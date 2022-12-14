const express = require('express');
const router = express.Router();
const data = require('../data');
const commentData = data.comment;

const utils = require('../utils');

const xss = require('xss');

router
    .route('/:id')
    .get(async (req, res) => {
        try {
            utils.checkId(req.params.id, ID);
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        try {
            let comment = await commentData.getComment(req.params.id);
            res.json(model);
        } catch (e) {
            res.status(404).json({error: 'Comment Not Found'})
        }
    })
    .post(async (req, res) => {
        try {
            utils.checkComment(  // Need a checkComment function in utils
                req.params.id,
                req.params.userName,
                req.params.comment
                );
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        let commentInfo = req.body;

        if (!commentInfo) {
            res.status(400).json({error: 'System requires you to provide a comment ID to complete the search operation'});
            return;
        }

        if (!commentInfo.id) {
            res.status(400).json({error: 'You must provide an ID for your comment'});
            return;
        }
        if (!commentInfo.userName) {
            res.status(400).json({error: 'You must provide an username for your comment'});
            return;
        }
        if (!commentInfo.comment) {
            res.status(400).json({error: 'You must provide the content of your comment'});
            return;
        }

        try {
            const newComment = await commentData.createComment(
                commentInfo.id,
                commentInfo.userName,
                commentInfo.comment
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

        let commentInfo = req.body;

        if (!commentInfo) {
            res.status(400).json({error: 'System requires you to provide a comment ID to complete the search operation'});
            return;
        }

        if (!commentInfo.id) {
            res.status(400).json({error: 'You must provide an ID for your comment'});
            return;
        }
        if (!commentInfo.userName) {
            res.status(400).json({error: 'You must provide an username for your comment'});
            return;
        }
        if (!commentInfo.comment) {
            res.status(400).json({error: 'You must provide the content of your comment'});
            return;
        }

        try {
            await commentData.getComment(req.params.id);
        } catch (e) {
            res.status(404).json({error: 'Comment Not Found'})
        }

        try {
            const updateComment = await commentData.updateComment(req.params.id, commentInfo);  // Need a updateComment function in utils
            res.json(updateComment);
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
            await modelData.getComment(req.params.id);
        } catch (e) {
            res.status(404).json({error: 'Comment Not Found'});
            return;
        }

        try {
            await commentData.removeComment(req.params.id);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(500);
        }
    })

module.exports = router;