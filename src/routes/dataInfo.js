const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;
const dataInfoData = data.dataInfo;

const path = require("path");
const utils = require('../utils');
const dl_dataprocess = require("../dl/js/dataprocess");

router
    .route("/")
    .get(async (req, res) => {

        try {
            return res.status(200).render("./data/create", {
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
    // create new data
    .post(async (req, res) => {

        let data_name = undefined;
        let data_description = undefined;
        let data_features = undefined;
        let data_length = undefined;
        let data_source = undefined;
        let data_rawdata = undefined;

        let newData = undefined;
        let dataId = undefined;

        try {
            // error check
            data_name = utils.checkString(req.body.data_name);
            data_description = utils.checkString(req.body.data_description);
            data_length = utils.checkInt(req.body.data_length);
            data_source = utils.checkUrl(req.body.data_source);
            data_rawdata = utils.checkRawData(req.files.data_rawdata);

            data_features = utils.str2strArray(req.body.data_features);
            data_features = utils.checkStringArray(data_features, "data features");

            // upload json file to server
            let upload_path = path.resolve(`./raw_data/${data_name}.json`)
            await data_rawdata.mv(upload_path);

            let userId = req.session.user.userId;

            newData = {
                name: data_name,
                description: data_description,
                features: data_features,
                length: data_length,
                source: data_source,
                file_path: upload_path,
                userId: userId
            }

            let data_db = await dataInfoData.createData(newData);
            dataId = data_db._id.toString();

            await userData.addData(userId, dataId);
            
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.redirect(`/data/id/${dataId}`);
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

        let dataId = undefined;
        let data_db = undefined;
        let user_name_list = [];

        try {
            dataId = utils.checkId(req.params.id, "data id");
            data_db = await dataInfoData.getDataById(dataId);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            for (userIdx in data_db.user_list) {
                userId = utils.checkId(data_db.user_list[userIdx], "user id");
                let user_db = await userData.getUserById(userId);
                user_name_list.push(user_db.username);
            }
            return res.status(200).render("./data/info", {
                username: req.session.user.username,
                dataId: dataId,
                data_name: data_db.data_name,
                description: data_db.description,
                features: data_db.features,
                length: data_db.length,
                source: data_db.source,
                raw_data_path: `../../data/rawdata/${dataId}`,
                user_list: user_name_list,
                comment: data_db.comment
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
    .put(async (req, res) => {})
    .delete(async (req, res) => {
        let dataId = undefined;
        let data_db = undefined;

        try {
            dataId = utils.checkId(req.params.id, "data id");
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            dataId = utils.checkId(req.params.id, "data id");
            data_db = await dataInfoData.getDataById(dataId);
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            dataId = utils.checkId(req.params.id, "data id");
            deleteInfo = dataInfoData.removeData(dataId);
            if (deleteInfo) {
                return res.redirect(`../user}`);
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
    .route("/rawdata/:id")
    .get(async (req, res) => {

        let dataId = undefined;
        let features = undefined;
        let dataSet_raw = [];
        let dataSet_norm = [];

        try {
            dataId = utils.checkId(req.params.id, "data id");
            let data_db = await dataInfoData.getDataById(dataId);
            features = data_db.features;

            for (let i=0; i<20; i++) {
                let single_data = await dl_dataprocess.loadData(dataId, i, getNorm=true);
                let single_set_raw = {};
                let single_set_norm = {};
                for (let j = 0; j < features.length; j++) {
                    single_set_raw[features[j]] = single_data.res[j];
                    single_set_norm[features[j]] = single_data.res_norm[j];
                }
                dataSet_raw.push(single_set_raw);
                dataSet_norm.push(single_set_norm);

            }
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            res.status(200).render("./data/rawData", {
                username: req.session.user.username,
                post_raw: dataSet_raw,
                post_norm: dataSet_norm
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
    .route("/search")
    .get(async (req, res) => {

        let data_list = undefined;

        try {
            data_list = await dataInfoData.getAllData();
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./data/searchRes", {
                username: req.session.user.username,
                data_list: data_list
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

        let search_input = req.body.search_input;
        let search_res = [];

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
            search_res = await dataInfoData.getDataByName(search_input);

            if (search_res.length === 0) {
                throw 'Data not found.';
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
            return res.render("./data/searchRes", {
                username: req.session.user.username,
                data_list: search_res
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

        let dataId = undefined;
        let data_db = undefined;

        try {
            dataId = utils.checkId(req.params.id, "data id");
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            data_db = await dataInfoData.getDataById(dataId);
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./data/edit", {
                username: req.session.user.username,
                dataId: dataId,
                data_name: data_db.data_name,
                description: data_db.description,
                features: data_db.features.toString(),
                length: data_db.length,
                source: data_db.source
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

        let dataId = req.params.id;
        let data_db = undefined;

        try {
            data_db = await dataInfoData.getDataById(dataId);
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        let data_name = undefined;
        let description = undefined;
        let features = undefined;
        let length = undefined;
        let source = undefined;

        try {

            data_name = utils.checkString(utils.prior(req.body.data_name, data_db.data_name));
            description = utils.checkString(utils.prior(req.body.data_description, data_db.description));
            features = utils.checkStringArray(utils.prior(req.body.data_features, data_db.features));
            length = utils.checkInt(utils.prior(req.body.data_length, data_db.length));
            source = utils.checkUrl(utils.prior(req.body.data_source, data_db.source));

        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            let newData = {
                name: data_name,
                description: description,
                features: features,
                length: length,
                source: source,
                file_path: data_db.file_path,
                userId: req.session.user.userId
            }

            let updateStatus = await dataInfoData.updateData(dataId, newData);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.redirect(`../info/${dataId}`);
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