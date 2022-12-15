//Here is where you'll set up your server as shown in lecture code

const express = require('express');
const app = express();

const static = express.static(__dirname + '/public');

const session = require('express-session');
const fileUpload = require("express-fileupload");
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

//--
const Handlebars = require('handlebars');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ['views/partials/']
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
    }
  
    // let the next middleware run:
    next();
};

app.use('/public', static);

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.engine('handlebars', exphbs.engine({helpers: {
        json: function (context) {
            return JSON.stringify(context);
        }
    } 		
}));

app.set('view engine', 'handlebars');

app.use(
    session({
        name: 'AuthCookie',
        secret: "This is a secret.. shhh don't tell anyone",
        resave: false,
        saveUninitialized: true
    })
);

app.use((req, res, next) => {
    let time = new Date().toUTCString();
    let method = req.method;
    let url = req.originalUrl;
    let user = req.session.user ? 'Authenticated User' : 'Non-Authenticated User';
    console.log(`[${time}]: ${method}, ${url}, ${(user)}`);

    next();
});

app.use('/user', (req, res, next) => {

  if (!req.session.user) {
      return res.redirect('/forbidden');
  } else {
      next();
  }
  
});

app.use('/data', (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/forbidden');
    } else {
        next();
    }
    
});

app.use('/model', (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/forbidden');
    } else {
        next();
    }
    
});

app.use('/search', (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/forbidden');
    } else {
        next();
    }
    
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});