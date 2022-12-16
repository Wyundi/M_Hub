const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;
const dataInfoData = data.dataInfo;

const path = require("path");
const utils = require('../utils');
const dl_dataprocess = require("../dl/js/dataprocess");

const xss = require('xss');

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
        let data_type = undefined;
        let data_description = undefined;
        let data_features = undefined;
        let data_length = undefined;
        let data_source = undefined;
        let data_rawdata = undefined;

        let newData = undefined;
        let dataId = undefined;

        try {
            // error check

            data_name = utils.checkString(xss(req.body.data_name));
            data_type = utils.checkString(xss(req.body.data_type));
            data_description = utils.checkString(xss(req.body.data_description));
            data_length = utils.checkInt(xss(req.body.data_length));
            data_source = utils.checkUrl(xss(req.body.data_source));

            data_rawdata = utils.checkRawData(req.files.data_rawdata);

            data_features = utils.str2strArray(xss(req.body.data_features));
            data_features = utils.checkStringArray(data_features, "data features");

            // upload json file to server
            let upload_path = path.resolve(`./raw_data/${data_name}.json`)
            await data_rawdata.mv(upload_path);

            let userId = req.session.user.userId;

            newData = {
                name: data_name,
                type: data_type,
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
            return res.redirect(`/data/info/${dataId}`);
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

        try {
            dataId = utils.checkId(xss(req.params.id), "data id");
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
            return res.status(200).render("./data/info", {
                username: req.session.user.username,
                dataId: dataId,
                data_name: data_db.data_name,
                data_type: data_db.type,
                description: data_db.description,
                features: data_db.features,
                length: data_db.length,
                source: data_db.source,
                raw_data_path: `../../data/raw${data_db.type}/${dataId}`,
                user_list: data_db.user_list,
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
    .post(async (req, res) => {})
    .put(async (req, res) => {})
    .delete(async (req, res) => {})

router
    .route("/rawdata/:id")
    .get(async (req, res) => {

        let dataId = undefined;
        let features = undefined;
        let res_ori = [];
        let res_norm = [];

        try {
            dataId = utils.checkId(xss(req.params.id), "data id");
            let data_db = await dataInfoData.getDataById(dataId);
            features = data_db.features;

            for (let i=0; i<20; i++) {
                let single_res = await dl_dataprocess.loadData(dataId, i, getNorm=true);
                res_ori.push(single_res.ori);
                res_norm.push(single_res.norm);
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
                features: features,
                res_ori: res_ori,
                res_norm: res_norm
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
    .route("/rawimg/:id")
    .get(async (req, res) => {

        try {
            return res.status(200).render("./data/rawImg", {
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
            let search_res = await dataInfoData.getDataByName(search_input);

            let no_res = (search_res.length === 0);
            return res.status(200).render("./data/searchRes", {
                no_res: no_res,
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
            dataId = utils.checkId(xss(req.params.id), "data id");
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
                data_type: data_db.type,
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

        let dataId = undefined;
        let data_db = undefined;

        try {
            xss(req.params.id)
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

        let data_name = undefined;
        let data_type = undefined;
        let description = undefined;
        let features = undefined;
        let length = undefined;
        let source = undefined;

        try {

            data_name = utils.checkString(utils.prior(xss(req.body.data_name), data_db.data_name));
            data_type = utils.checkDataType(utils.prior(xss(req.body.data_type), data_db.type));
            description = utils.checkString(utils.prior(xss(req.body.data_description), data_db.description));
            features = utils.checkStringArray(utils.prior(xss(req.body.data_features), data_db.features));
            length = utils.checkInt(utils.prior(xss(req.body.data_length), data_db.length));
            source = utils.checkUrl(utils.prior(xss(req.body.data_source), data_db.source));


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
                type: data_type,
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