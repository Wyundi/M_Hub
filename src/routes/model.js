const express = require('express');
const router = express.Router();
const data = require('../data');
const modelData = data.model;

const path = require('path');
const utils = require('../utils');
const { read } = require('fs');

router
    .route('/:id')
    .get(async (req, res) => {
        try {
            utils.checkId(req.params.id, ID);
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        try {
            let model = await modelData.getModelById(req.params.id);
            res.json(model);
        } catch (e) {
            res.status(404).json({error: 'Model Not Found'})
        }
    })

    .post(async (req, res) => {
        try {
            utils.checkModel(  // Need a checkModel function in utils
                req.params.name,
                req.params.category,
                req.params.description,
                req.params.link,
                req.params.structure,
                req.params.input,
                req.params.output,
                req.params.userId,
                req.params.dataId
                );
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        let modelInfo = req.body;

        if (!modelInfo) {
            res.status(400).json({error: 'System requires you to provide a model ID to complete the search operation'});
            return;
        }

        if (!modelInfo.name) {
            res.status(400).json({error: 'You must provide a name for your model'});
            return;
        }
        if (!modelInfo.category) {
            res.status(400).json({error: 'You must provide us which category your model belongs to'});
            return;
        }
        if (!modelInfo.description) {
            res.status(400).json({error: 'You must provide a brief description for your model'});
            return;
        }
        if (!modelInfo.link) {
            res.status(400).json({error: 'You must provide a link for your model'});
            return;
        }
        if (!modelInfo.structure) {
            res.status(400).json({error: 'You must provide us which structure your model belongs to'});
            return;
        }
        if (!modelInfo.input) {
            res.status(400).json({error: 'You must provide the input data of your model'});
            return;
        }
        if (!modelInfo.output) {
            res.status(400).json({error: 'You must provide the output data of your model'});
            return;
        }
        if (!modelInfo.userId) {
            res.status(400).json({error: 'You must provide the userID for your model'});
            return;
        }
        if (!modelInfo.dataId) {
            res.status(400).json({error: 'You must provide the dataID for your model'});
            return;
        }

        try {
            const newModel = await modelData.createModel(
                modelInfo.name,
                modelInfo.category,
                modelInfo.description,
                modelInfo.link,
                modelInfo.structure,
                modelInfo.input,
                modelInfo.output,
                modelInfo.userId,
                modelInfo.dataId
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

        let modelInfo = req.body;

        if (!modelInfo) {
            res.status(400).json({error: 'System requires you to provide a model ID to complete the search operation'});
            return;
        }

        if (!modelInfo.name) {
            res.status(400).json({error: 'You must provide a name for your model'});
            return;
        }
        if (!modelInfo.category) {
            res.status(400).json({error: 'You must provide us which category your model belongs to'});
            return;
        }
        if (!modelInfo.description) {
            res.status(400).json({error: 'You must provide a brief description for your model'});
            return;
        }
        if (!modelInfo.link) {
            res.status(400).json({error: 'You must provide a link for your model'});
            return;
        }
        if (!modelInfo.structure) {
            res.status(400).json({error: 'You must provide us which structure your model belongs to'});
            return;
        }
        if (!modelInfo.input) {
            res.status(400).json({error: 'You must provide the input data of your model'});
            return;
        }
        if (!modelInfo.output) {
            res.status(400).json({error: 'You must provide the output data of your model'});
            return;
        }
        if (!modelInfo.userId) {
            res.status(400).json({error: 'You must provide the userID for your model'});
            return;
        }
        if (!modelInfo.dataId) {
            res.status(400).json({error: 'You must provide the dataID for your model'});
            return;
        }

        try {
            await modelData.getModelById(req.params.id);
        } catch (e) {
            res.status(404).json({error: 'Model Not Found'})
        }

        try {
            const updateModel = await modelData.updateModel(req.params.id, modelInfo);
            res.json(updateModel);
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
            await modelData.getModelById(req.params.id);
        } catch (e) {
            res.status(404).json({error: 'Model Not Found'});
            return;
        }

        try {
            await modelData.removeModel(req.params.id);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(500);
        }
    })

module.exports = router;