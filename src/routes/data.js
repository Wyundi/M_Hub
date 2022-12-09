const express = require('express');
const router = express.Router();
const data = require('../data');
const dataInfoData = data.dataInfo;

const path = require('path');
const utils = require('../utils');

router
    .route('/:id')
    .get(async (req, res) => {
        try {
            utils.checkId(req.params.id, ID);
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        try {
            let dataInfo = await dataInfoData.getDataById(req.params.id);
            res.json(dataInfo);
        } catch (e) {
            res.status(404).json({error: 'Data Not Found'})
        }
    })
    .post(async (req, res) => {  // Need a checkData function in utils
        try {
            utils.checkData(
                req.params.name,
                req.params.description,
                req.params.features,
                req.params.length,
                req.params.source,
                req.params.file_path,
                req.params.userId
                );
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        let dataInfo = req.body;

        if (!dataInfo) {
            res.status(400).json({error: 'System requires you to provide a data ID to complete the search operation'});
            return;
        }

        if (!dataInfo.name) {
            res.status(400).json({error: 'You must provide a name for your data'});
            return;
        }
        if (!dataInfo.description) {
            res.status(400).json({error: 'You must provide a brief description for your data'});
            return;
        }
        if (!dataInfo.features) {
            res.status(400).json({error: 'You must provide features for your data'});
            return;
        }
        if (!dataInfo.length) {
            res.status(400).json({error: 'You must provide the length of your data'});
            return;
        }
        if (!dataInfo.source) {
            res.status(400).json({error: 'You must provide the source of your data'});
            return;
        }
        if (!dataInfo.userId) {
            res.status(400).json({error: 'You must provide the userID for your data'});
            return;
        }

        try {
            const newData = await dataInfoData.createData(
                dataInfo.name,
                dataInfo.description,
                dataInfo.features,
                dataInfo.length,
                dataInfo.source,
                dataInfo.file_path,
                dataInfo.userId
            );
        } catch (e) {
            res.sendStatus(500);
        }
    })
    .put(async (req, res) => {
        try {
            utils.checkId(req.params.id, ID);
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        let dataInfo = req.body;

        if (!dataInfo) {
            res.status(400).json({error: 'System requires you to provide a data ID to complete the search operation'});
            return;
        }

        if (!dataInfo.name) {
            res.status(400).json({error: 'You must provide a name for your data'});
            return;
        }
        if (!dataInfo.description) {
            res.status(400).json({error: 'You must provide a brief description for your data'});
            return;
        }
        if (!dataInfo.features) {
            res.status(400).json({error: 'You must provide features for your data'});
            return;
        }
        if (!dataInfo.length) {
            res.status(400).json({error: 'You must provide the length of your data'});
            return;
        }
        if (!dataInfo.source) {
            res.status(400).json({error: 'You must provide the source of your data'});
            return;
        }
        if (!dataInfo.userId) {
            res.status(400).json({error: 'You must provide the userID for your data'});
            return;
        }

        try {
            await dataInfoData.getDataById(req.params.id);
        } catch (e) {
            res.status(404).json({error: 'Data Not Found'})
        }

        try {
            const updateData = await dataInfoData.updateData(req.params.id, dataInfo);  // Need a updateData function in dataInfo
            res.json(updateData);
        } catch (e) {
            res.sendStatus(500);
        }
})
    .delete(async (req, res) => {
        try {
            utils.checkId(req.params.id, ID);
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        try {
            await dataInfoData.getDataById(req.params.id);
        } catch (e) {
            res.status(404).json({error: 'Model Not Found'});
            return;
        }

        try {
            await dataInfoData.removeData(req.params.id);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(500);
        }
    })

module.exports = router;