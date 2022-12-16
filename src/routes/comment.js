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
            res.status(400).render("./error/errorPage", {error_message: e});
            return;
        }

        try {
            await modelData.getModelById(modelId);
        } catch(e) {
            res.status(404).render("./error/searchNotFound", {error_message: e});
            return;
        }

        try {
            const allComments = await commentData.getAllComment(modelId);
            if (allComments.length == 0) {
              return res.status(404).render("./error/searchNotFound", {error_message: e});
            }
            // where should it be redirected?
            res.status(200).render("./model/info");
          } catch(e) {
            res.status(500).render("./error/searchNotFound", {error_message: e});
          }
    })
    .post(async (req, res) => {
        let commentInfo = req.body;

        try {
          modelId = utils.checkId(req.params.modelId, 'model id');
          username = utils.checkUsername(commentInfo.userName);
          comment = utils.checkComment(commentInfo.comment);
        } catch(e) {
          res.status(400).render("./model/info", {error_message: e});
          return;
        }
    
        try{
          await modelData.getModelById(modelId);
        } catch(e) {
          res.status(404).render("./model/info", {error_message: e});
          return;
        }
    
        try {
          await commentData.createComment(movieId, username, comment);
          res.status(200).render("./model/info");
        } catch(e) {
          res.status(500).render("./model/info", {error_message: e});
        }
    })

  router
    .route('comment/:commentId')
    .delete(async (req, res) => {
      try {
        commentId = utils.checkId(req.params.commentId, 'comment id');
      } catch(e) {
        res.status(400).render("./error/searchNotFound", {error_message: e});
        return;
      }
  
      try {
        await commentData.getComment()
      } catch(e) {
        res.status(404).render("./error/searchNotFound", {error_message: e});
        return;
      }
  
      try {
        const updatedComments = await commentData.updatedComments(commentId);
        res.status(200).render("./model/info");
      } catch (e) {
        res.status(500).render("./error/errorPage", {error_message: e});
      }
    })

module.exports = router;