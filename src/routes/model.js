const express = require('express');
const router = express.Router();
const data = require('../data');
const modelData = data.model ;

const path = require('path');
const utils = require('../utils');

router
    .route('/model/:id')
    .get(async (req, res) => {

        let modelId = undefined;
        let model_db = undefined;

        try {
            modelId = utils.checkId(req.params.id, "model id");
            model_db = await modelData.getModelById(modelId);
        } catch (e) {
            return res.status(400).render("./error/errorPage", {
                error_status: 400,
                error_message: "400 Error:" + e
            });
        }

        try {
            return res.status(200).render("./model/modelInfo", {
                username: req.session.user.username,
                model_name: model_db.model_name,
                category: model_db.category,
                description: model_db.description,
                link: model_db.link,
                onnx_path: model_db.onnx_path,
                input: model_db.input,
                output: model_db.output,
                user_list: model_db.user_list,
                dataId: model_db.data_list,
                comment: model_db.comment
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

module.exports = router;