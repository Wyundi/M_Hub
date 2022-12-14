const express = require('express');
const router = express.Router();

const data = require("../data");
const dataInfoData = data.dataInfo;
const modelData = data.model ;

const utils = require('../utils');

const xss = require('xss');

router
    .route('/')
    // get function should display a list of current data / model or user
    .get(async (req, res) => {

        try {
            return res.status(200).render("./search/searchPage", {
                username: req.session.user.username
            })
        }  catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }
    })
    // post function should show search result
    .post(async (req, res) => {

        let search_input = undefined;
        let data_search_res = [];
        let model_search_res = [];

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
                let error_status = 404;
                return res.status(403).render('./error/searchNotFound', {
                    username: req.session.user.username,
                    error_status: error_status,
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
            data_search_res = await dataInfoData.getDataByName(search_input);
            model_search_res = await modelData.getModelByName(search_input);
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/searchNotFound", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            let no_res = (data_search_res.length === 0 && model_search_res.length === 0);
            return res.status(200).json({
                no_res: no_res,
                data_search_res: data_search_res,
                model_search_res: model_search_res
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

module.exports = router;