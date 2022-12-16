const userRoutes = require("./user");
const modelRoutes = require("./model");
const dataInfoRoutes = require("./dataInfo");
const commentRoutes = require("./comment");
const searchRoutes = require("./search");

const constructorMethod = (app) => {

    app.use('/', userRoutes);
    app.use('/model', modelRoutes);
    app.use('/data', dataInfoRoutes);
    app.use('/', commentRoutes);
    app.use('/search', searchRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('./error/errorPage', {
            error_status: '404',
            error_message: 'Page Not Found.'
        })
    });
};

module.exports = constructorMethod;