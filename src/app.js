//Here is where you'll set up your server as shown in lecture code

const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
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

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});