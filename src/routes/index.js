const userRoutes = require("./user");
const modelRoutes = require("./model");
const modeoDataRoutes = require("./modelData");
const commentRoutes = require("./comment");

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/model', modelRoutes);
    app.use('/modeldata', modeoDataRoutes);
    app.use('/comment', commentRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('./error', {
            error_status: '404',
            error_message: e
        })
    });
};

module.exports = constructorMethod;