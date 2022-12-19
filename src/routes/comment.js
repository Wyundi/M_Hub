const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comment; 
const modelData = data.model;
const dataInfo = data.dataInfo;
const utils = require('../utils');

const xss = require('xss');

router
    .route('/data/:dataId')
    .get(async (req, res) => {

        let dataId = undefined;
        let data_db = undefined;

        try {
            dataId = utils.checkId(req.params.dataId, 'data id');
        } catch(e) {
          let error_status = 400;
          return res.status(error_status).render("./error/errorPage", {
              username: req.session.user.username,
              error_status: error_status,
              error_message: e
          });
        }

        try {
            data_db = await dataInfo.getDataById(dataId);
        } catch(e) {
          let error_status = 404;
          return res.status(error_status).render("./error/errorPage", {
              username: req.session.user.username,
              error_status: error_status,
              error_message: e
          });
        }

        try {
            const allComments = await commentData.getAllComment(dataId, 'data');
            return res.status(200).render("./comment/datacomment", {
              dataId: dataId,
              data_name: data_db.data_name,
              comment: allComments,
            });
          } catch(e) {
            let error_status = 500;
          return res.status(error_status).render("./error/errorPage", {
            username: req.session.user.username,
            error_status: error_status,
            error_message: e
          });
          }
    })
    .post(async (req, res) => {
        let commentInfo = req.body;
        let data_db = undefined;

        try {
          dataId = utils.checkId(xss(req.params.dataId, 'data id'));
          username = utils.checkUsername(xss(req.session.user.username));
          comment = utils.checkString(xss(commentInfo.comment));
        } catch(e) {
          let error_status = 400;
          res.status(error_status).render("./error/errorPage", {
            error_status: error_status, 
            error_message: e
          });
          return;
        }
    
        try{
          data_db = await dataInfo.getDataById(dataId);
        } catch(e) {
          let error_status = 404;
          res.status(error_status).render("./error/errorPage", {
            error_status: error_status, 
            error_message: e});
          return;
        }
    
        try {
          newComment = await commentData.createComment(dataId, username, comment, 'data');
          const allComments = await commentData.getAllComment(dataId, 'data');
          if (newComment) {
            res.status(200).render("./comment/datacomment", {
              username: username,
              dataId: dataId,
              data_name: data_db.data_name,
              comment: allComments,
            });
          }
        } catch(e) {
          let error_status = 500;
          res.status(500).render("./error/errorPage", {
            error_status:error_status,
            error_message: e
          });
        }
    })

router
    .route('/model/:modelId')
    .get(async (req, res) => {

      let modelId = undefined;
      let model_db = undefined;

      try {
        modelId = utils.checkId(xss(req.params.modelId, 'model id'));
      } catch(e) {
        let error_status = 400;
        return res.status(error_status).render("./error/errorPage", {
            username: req.session.user.username,
            error_status: error_status,
            error_message: e
        });
      }

      try {
        model_db = await modelData.getModelById(modelId);
      } catch(e) {
        let error_status = 404;
        return res.status(error_status).render("./error/errorPage", {
            username: req.session.user.username,
            error_status: error_status,
            error_message: e
        });
      }

      try {
          const allComments = await commentData.getAllComment(modelId, 'model');
          return res.status(200).render("./comment/modelcomment", {
            modelId: modelId,
            model_name: model_db.model_name,
            comment: allComments,
          });
        } catch(e) {
          let error_status = 500;
        return res.status(error_status).render("./error/errorPage", {
          username: req.session.user.username,
          error_status: error_status,
          error_message: e
        });
        }
  })
    .post(async (req, res) => {
        let commentInfo = req.body;
        let model_db = undefined;
        
        try {
          modelId = utils.checkId(xss(req.params.modelId, 'model id'));
          username = utils.checkUsername((xss(req.session.user.username)));
          comment = utils.checkString(xss(commentInfo.comment));
        } catch(e) {
          let error_status = 400;
          res.status(error_status).render("./error/errorPage", {
            error_status: error_status, 
            error_message: e
          });
          return;
        }
    
        try{
          model_db = await modelData.getModelById(modelId);
        } catch(e) {
          let error_status = 404;
          res.status(error_status).render("./error/errorPage", {
            error_status: error_status, 
            error_message: e});
          return;
        }
    
        try {
          newComment = await commentData.createComment(modelId, username, comment, 'model');
          const allComments = await commentData.getAllComment(modelId, 'model');
          if (newComment) {
            res.status(200).render("./comment/modelcomment", {
              username: username,
              modelId: modelId,
              model_name: model_db.model_name,
              comment: allComments,
            });
          }
        } catch(e) {
          let error_status = 500;
          res.status(500).render("./error/errorPage", {
            error_status:error_status,
            error_message: e
          });
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