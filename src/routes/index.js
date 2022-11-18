const userRoutes = require("./user");
const modelRoutes = require("./model");
const dataRoutes = require("./data");
const commentRoutes = require("./comment");
const searchRoutes = require("./search");

const path = require('path');

const constructorMethod = (app) => {
    app.use('/', (req, res) => {
        res.status(200).sendFile(path.resolve('./static/homepage.html'));
    })
    app.use('/user', userRoutes);
    app.use('/model', modelRoutes);
    app.use('/data', dataRoutes);
    app.use('/comment', commentRoutes);
    app.use('/search', searchRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('./error', {
            error_status: '404',
            error_message: e
        })
    });
};

module.exports = constructorMethod;