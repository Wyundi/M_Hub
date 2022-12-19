const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;
const dataInfoData = data.dataInfo;
const modelData = data.model ;

const path = require('path');
const utils = require('../utils');

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
        let upload_path = undefined;

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
            upload_path = path.resolve(`./onnx/${model_name}.onnx`);
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
        let user_name_list = [];
        let data_name_list = [];

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
            userId = utils.checkId(xss(req.session.user.userId), "user id");

            // check if contributor
            let contributorId = model_db.user_list[0];
            let user_db = await userData.getUserById(contributorId);
            let contributor = user_db.username;
            let is_contributor = req.session.user.userId === contributorId;

            // check if own this model
            let user_in_model_user_list = model_db.user_list.includes(req.session.user.userId);

            let data_info_list = [];
            for (let i = 0; i < model_db.data_list.length; i++) {
                let data_info = {};
                data_db = await dataInfoData.getDataById(model_db.data_list[i]);
                data_name = data_db.data_name;
                data_info.id = model_db.data_list[i];
                data_info.name = data_name;
                data_info_list.push(data_info);
            }

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
                contributor: contributor,
                data_info_list: data_info_list,
                comment: model_db.comment,
                is_contributor: is_contributor,
                user_in_model_user_list: user_in_model_user_list
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
    .post(async (req, res) => {
        let userId = undefined;
        let modelId = undefined;
        let user_db = undefined;
        let model_db = undefined;

        try {
            userId = utils.checkId(xss(req.session.user.userId, "user id"));
            modelId = utils.checkId(xss(req.body.modelId, "model id"));
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            user_db = await userData.getUserById(userId);
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
            userId = utils.checkId(xss(req.session.user.userId), "user id");
            contributorId = model_db.user_list[0];
            let contributor_db = await userData.getUserById(contributorId);
            contributor = contributor_db.username;
            let is_contributor = req.session.user.userId === contributorId;

            let data_info_list = [];
            for (let i = 0; i < model_db.data_list.length; i++) {
                let data_info = {};
                data_db = await dataInfoData.getDataById(model_db.data_list[i]);
                data_name = data_db.data_name;
                data_info.id = model_db.data_list[i];
                data_info.name = data_name;
                data_info_list.push(data_info);
            }

            if (user_db.model_list.includes(modelId)) {
                let message = 'Model already contained in your list';
                let notification = 'true';
                return res.render("./model/info", {
                    username: req.session.user.username,
                    modelId: modelId,
                    model_name: model_db.model_name,
                    category: model_db.category,
                    description: model_db.description,
                    link: model_db.link,
                    onnx_path: model_db.onnx_path,
                    input: model_db.input,
                    output: model_db.output,
                    contributor: contributor,
                    data_info_list: data_info_list,
                    comment: model_db.comment,
                    is_contributor: is_contributor,
                    message: message,
                    notification: notification
                });
            } else {
                userUpdateInfo = await userData.addModel(userId, modelId);    // add modelid to user's model list
                modelUpdateInfo = await modelData.addUser(modelId, userId);      // add userid to model's userlist
                let message = 'Model added successfully';
                let notification = 'true';
                if (userUpdateInfo && modelUpdateInfo) {
                    return res.render("./model/info", {
                        username: req.session.user.username,
                        modelId: modelId,
                        model_name: model_db.model_name,
                        category: model_db.category,
                        description: model_db.description,
                        link: model_db.link,
                        onnx_path: model_db.onnx_path,
                        input: model_db.input,
                        output: model_db.output,
                        contributor: contributor,
                        data_info_list: data_info_list,
                        comment: model_db.comment,
                        is_contributor: is_contributor,
                        message: message,
                        notification: notification
                    });
                };
            }
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }
    })
    .delete(async (req, res) => {
        let modelId = undefined;
        let model_db = undefined;

        try {
            modelId = utils.checkId(req.params.id, "model id");
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            modelId = utils.checkId(req.params.id, "model id");
            model_db = await modelData.getModelById(modelId);
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        /* owner delete: 1. delete model from db    2. all users' model list --    3. add data's model list --
         * not owner delete: current user's model list --
         */

        try {
            userId = utils.checkId(req.session.user.userId, "user id");
            if (userId === model_db.user_list[0]) {
                for (user of model_db.user_list) {
                    userRemoveInfo = await userData.removeFromModelList(user, modelId);
                    if (!userRemoveInfo) throw 'remove modelid from user profile failed'
                }

                for (data_id of model_db.data_list) {
                    dataRemoveInfo = await dataInfoData.removeFromModelList(data_id, modelId);
                    if (!dataRemoveInfo) throw 'remove modelid from data profile failed'
                }

                modelRemoveInfo = await modelData.removeModel(modelId);

                if (modelRemoveInfo) return res.redirect("/user");
                else {
                    throw "failed to delete model"
                }
            } else {
                userRemoveInfo = await userData.removeFromModelList(userId, modelId);
                modelRemoveInfo = await modelData.removeFromUserList(modelId, userId);
                if (userRemoveInfo && modelRemoveInfo) {
                    return res.redirect("/user");
                }
                else {
                    throw "failed to delete model"
                }
            }
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

        let search_input = undefined;

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
            let search_res = await modelData.getModelByName(search_input);     

            let no_res = (search_res.length === 0);
            return res.status(200).render("./model/searchRes", {
                no_res: no_res,
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
    .put(async (req, res) => {

        let modelId = undefined;
        let model_db = undefined;

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