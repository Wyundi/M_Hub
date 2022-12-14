const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;
const dataInfoData = data.dataInfo;
const modelData = data.model ;

const path = require('path');
const utils = require('../utils');
const { model } = require('../data');

const xss = require('xss');

router
    .route("/")
    .get(async (req, res) => {

        try {
            return res.status(200).render("./model/create", {
                username: req.session.user.username
            })
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

    })
    // create new model
    .post(async (req, res) => {

        let model_name = undefined;
        let model_category = undefined;
        let model_description = undefined;
        let model_link = undefined;
        let model_input = undefined;
        let model_output = undefined;
        let onnx_path = undefined;

        let newModel = undefined;
        let modelId = undefined;

        try {
            // error check
            model_name = utils.checkString(xss(req.body.model_name));
            model_category = utils.checkString(xss(req.body.model_category));
            model_description = utils.checkString(xss(req.body.model_description));
            model_link = utils.checkUrl(xss(req.body.model_link));
            model_input = utils.checkString(xss(req.body.model_input));
            model_output = utils.checkString(xss(req.body.model_output));
            model_data = utils.checkString(xss(req.body.model_data));

            // upload onnx file to server
            let onnx_file = req.files.onnx_file;
            let upload_path = path.resolve(`./onnx/${model_name}.onnx`)
            await onnx_file.mv(upload_path);

            // search data from data list
            let data_list = await dataInfoData.getDataByName(model_data);

            let userId = req.session.user.userId;
            let dataId = data_list[0]._id.toString();

            newModel = {
                name: model_name,
                category: model_category,
                description: model_description,
                link: model_link,
                onnx_path: upload_path,
                input: model_input,
                output: model_output,
                userId: userId,
                dataId: dataId
            }

            let model_db = await modelData.createModel(newModel);
            modelId = model_db._id.toString();

            await userData.addModel(userId, modelId);
            
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.redirect(`/model/info/${modelId}`);
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

    })

router
    .route("/info/:id")
    .get(async (req, res) => {

        let modelId = undefined;
        let model_db = undefined;

        try {
            modelId = utils.checkId(xss(req.params.id), "model id");
            model_db = await modelData.getModelById(modelId);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./model/info", {
                username: req.session.user.username,
                modelId: modelId,
                model_name: model_db.model_name,
                category: model_db.category,
                description: model_db.description,
                link: model_db.link,
                onnx_path: model_db.onnx_path,
                input: model_db.input,
                output: model_db.output,
                user_list: model_db.user_list,
                data_list: model_db.data_list,
                comment: model_db.comment
            });
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

    })
    .put(async (req, res) => {
        // // update models
        // let modelId = req.session.userId;
        // let model_db = undefined;

        // try {
        //     model_db = await modelData.getModelById(modelId);
        // } catch (e) {
        //     let error_status = 400;
        //     return res.status(error_status).render("./error/errorPage", {
        //         username: req.session.user.username,
        //         error_status: error_status,
        //         error_message: e
        //     });
        // }

        // let model_name = undefined;
        // let category = undefined;
        // let description = undefined;
        // let link = undefined;
        // let onnx_path = undefined;
        // let input = undefined;
        // let output = undefined;
        // let user_list = undefined;
        // let data_list = undefined;
        // let comment = undefined;

        // try {
        //     model_name = utils.checkString(utils.prior(req.body.model_name, model_db.model_name));
        //     category = utils.checkString(utils.prior(req.body.model_category, model_db.category));
        //     description = utils.checkString(utils.prior(req.body.model_description, model_db.description));
        //     link = utils.checkUrl(utils.prior(req.body.model_link, model_db.link));
        //     input = utils.checkString(utils.prior(req.body.model_input, model_db.input));
        //     output = utils.checkString(utils.prior(req.body.model_output, model_db.output));
        //     model_data = utils.checkString(req.body.model_data);
        // } catch (e) {
        //     let error_status = 400;
        //     return res.status(error_status).render("./error/errorPage", {
        //         username: req.session.username,
        //         error_status: error_status,
        //         error_message: e
        //     });
        // }

        // if (!model_db.data_list.contains(model_data)){
        //     model_db.data_list.push(model_data);
        // }

        // let newModel = undefined;
        // try {
        //     newModel = {
        //         model_name: model_name,
        //         category: category,
        //         description: description,
        //         link: link,
        //         onnx_path: model_db.onnx_path,
        //         input: input,
        //         output: output,
        //         user_list: model_db.user_list,
        //         data_list: model_db.data_list,
        //         comment: model_db.comment
        //     }

        //     let updateStatus = await modelData.updateModel(modelId,newModel);

        //     res.redirect(`../info/${modelId}`);
        // } catch (e) {
        //     let error_status = 500;
        //     return res.status(error_status).render("./error/errorPage", {
        //         username: req.session.username,
        //         error_status:error_status,
        //         error_message: e
        //     });
        // }

    })
    .delete(async (req, res) => {})

router
    .route("/structure/:id")
    .get(async (req, res) => {})

router
    .route("/search")
    .get(async (req, res) => {

        let model_list = undefined;

        try {
            model_list = await modelData.getAllModel();
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./model/searchRes", {
                username: req.session.user.username,
                model_list: model_list
            })
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

    })
    .post(async (req, res) => {

        let search_input = undefined
        let search_res = [];

        try {
            search_input = xss(req.body.search_input);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            if (search_input === '') {
                return res.render('./error/searchNotFound', {
                    username: req.session.user.username,
                    error_message: "Please enter your search."
                });
            }
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            search_input = utils.checkString(search_input);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            search_res = await modelData.getModelByName(search_input);

            if (search_res.length === 0) {
                throw 'Model not found.';
            }
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/searchNotFound", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.render("./model/searchRes", {
                username: req.session.user.username,
                model_list: search_res
            })
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

    })

router
    .route("/edit/:id")
    .get(async (req, res) => {

        let modelId = undefined;
        let model_db = undefined;
        console.log('222');

        try {
            modelId = utils.checkId(xss(req.params.id), "model id");
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            model_db = await modelData.getModelById(modelId);
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./model/edit", {
                username: req.session.user.username,
                modelId: modelId,
                model_name: model_db.model_name,
                model_category: model_db.category,
                model_description: model_db.description,
                model_link: model_db.link,
                model_input: model_db.input,
                model_output: model_db.output
            })
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

    })
    .post(async (req, res) => {

        let modelId = undefined
        let model_db = undefined;

        try {
            modelId = xss(req.params.id);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            model_db = await modelData.getModelById(modelId);
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        let model_name = undefined;
        let model_category = undefined;
        let model_description = undefined;
        let model_link = undefined;
        let model_input = undefined;
        let model_output = undefined;
        let model_data = undefined;

        try {

            model_name = utils.checkString(utils.prior(xss(req.body.model_name), model_db.model_name));
            model_category = utils.checkString(utils.prior(xss(req.body.model_category), model_db.category));
            model_description = utils.checkString(utils.prior(xss(req.body.model_description), model_db.description));
            model_link = utils.checkUrl(utils.prior(xss(req.body.model_link), model_db.link));
            model_input = utils.checkString(utils.prior(xss(req.body.model_input), model_db.input));
            model_output = utils.checkString(utils.prior(xss(req.body.model_output), model_db.output));
            model_data = utils.checkId(utils.prior(xss(req.body.model_data), model_db.data_list[0]))

        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            let newModel = {
                name: model_name,
                category: model_category,
                description: model_description,
                link: model_link,
                onnx_path: model_db.onnx_path,
                input: model_input,
                output: model_output,
                userId: req.session.user.userId,
                dataId: model_db.data_list[0]
            }

            let updateStatus = await modelData.updateModel(modelId, newModel);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.redirect(`../info/${modelId}`);
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

    })

module.exports = router;