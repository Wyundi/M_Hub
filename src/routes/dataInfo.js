const express = require('express');
const router = express.Router();
const data = require('../data');
const dataInfoData = data.dataInfo;

const path = require('path');
const utils = require('../utils');

router
    .route('/data/:id')
    .get(async (req, res) => {

        let dataId = undefined;
        let data_db = undefined;

        try {
            dataId = utils.checkId(req.params.id, "data id");
            data_db = await dataInfoData.getDataById(dataId);
        } catch (e) {
            return res.status(400).render("./error/errorPage", {
                error_status: 400,
                error_message: "400 Error:" + e
            });
        }

        try {
            return res.status(200).render("./data/dataInfo", {
                username: req.session.user.username,
                data_name: data_db.data_name,
                description: data_db.description,
                features: data_db.features,
                length: data_db.length,
                source: data_db.source,
                raw_data_path: `../../rawdata/:${dataId}`,
                user_list: data_db.user_list,
                comment: data_db.comment
            });
        } catch (e) {
            return res.status(400).render("./error/errorPage", {
                error_status: 500,
                error_message: "500 Error:" + e
            });
        }
    })
    .post(async (req, res) => {})
    .put(async (req, res) => {})
    .delete(async (req, res) => {})

router
    .route("/rawdata/:id")
    .get(async (req, res) => {})

module.exports = router;