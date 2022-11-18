const userRoutes = require("./user");
const modelRoutes = require("./model");
const dataRoutes = require("./data");
const commentRoutes = require("./comment");
const searchRoutes = require("./search");

const path = require('path');

const constructorMethod = (app) => {

    app.use('/', userRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('./error', {
            error_status: '404',
            error_message: 'Page Not Found.'
        })
    });
};

module.exports = constructorMethod;