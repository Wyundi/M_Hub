const userRoutes = require("./user");
const modelRoutes = require("./model");
const modeoDataRoutes = require("./modelData");
const commentRoutes = require("./comment");
const searchRoutes = require("./search");

const path = require('path');

const constructorMethod = (app) => {
    app.use('/', (req, res) => {
        res.status(200).sendFile(path.resolve('./static/homepage.html'));
    })
    app.use('/usr', userRoutes);
    app.use('/model', modelRoutes);
    app.use('/modeldata', modeoDataRoutes);
    app.use('/comment', commentRoutes);
    app.usr('/search', searchRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('./error', {
            error_status: '404',
            error_message: e
        })
    });
};

module.exports = constructorMethod;