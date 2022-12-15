const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comment; 
const modelData = data.model;
const utils = require('../utils');

router
    .route('/:modelId')
    .get(async (req, res) => {
        try {
            modelId = utils.checkId(req.params.modelId, 'model id');
        } catch(e) {
            res.status(400).json({error: e});
            return;
        }

        try {
            await modelData.getModelById(modelId);
        } catch(e) {
            res.status(404).json({error: 'model not found'});
            return;
        }

        try {
            const allComments = await commentData.getAllComment(modelId);
            if (allComments.length == 0) {
              return res.status(404).json({error: 'No comments for this model'});
            }
            res.status(200).json(allComments);
          } catch(e) {
            res.status(500).json({error: "model not found"});
          }
    })
    .post(async (req, res) => {
        let commentInfo = req.body;

        try {
          modelId = utils.checkId(req.params.modelId, 'model id');
          username = utils.checkUsername(userName);
          comment = utils.checkComment(comment);
        } catch(e) {
          res.status(400).json({error: e});
          return;
        }
    
        try{
          await modelData.getModelById(modelId);
        } catch(e) {
          res.status(404).json({error: "model not found"});
          return;
        }
    
        try {
          await commentData.createComment(movieId, username, comment);
          res.status(200).json(await modelData.getModelById(modelId));
        } catch(e) {
          res.status(500).json({error: "model not found"});
        }
    })
    .put(async (req, res) => {
    })
    .delete(async (req, res) => {})

module.exports = router;