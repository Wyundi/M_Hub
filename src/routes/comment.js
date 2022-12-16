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
            utils.checkId(xss(req.params.id), ID);
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        try {
            let comment = await commentData.getComment(xss(req.params.id));
            res.json(model);
        } catch (e) {
            res.status(404).json({error: 'Comment Not Found'})
        }
    })
    .post(async (req, res) => {
        try {
            utils.checkComment(  // Need a checkComment function in utils
                xss(req.params.id),
                xss(req.params.userName),
                xss(req.params.comment)
                );
            } catch (e) {
                return res.status(400).json({error: 'Invalid Input'});
            }

        let commentInfo = undefined

        try {
            commentInfo = xss(req.body); // not exactly sure if xss shoule be here, delete if run into any issues

            if (!xss(commentInfo)) {
                res.status(400).json({error: 'System requires you to provide a comment ID to complete the search operation'});
                return;
            }

            if (!xss(commentInfo.id)) {
                res.status(400).json({error: 'You must provide an ID for your comment'});
                return;
            }
            if (!xss(commentInfo.userName)) {
                res.status(400).json({error: 'You must provide an username for your comment'});
                return;
            }
            if (!xss(commentInfo.comment)) {
                res.status(400).json({error: 'You must provide the content of your comment'});
                return;
            }
        } catch (e) {
            res.status(400).json({error: e});
            return;
        }

        try {
            const newComment = await commentData.createComment(
                xss(commentInfo.id),
                xss(commentInfo.userName),
                xss(commentInfo.comment)
            );
        } catch (e) {
            res.sendStatus(500);
        }
    })
    .put(async (req, res) => {
        try {
            utils.checkId(xss(req.params.id), ID);
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        let commentInfo = undefined;

        try {
            let commentInfo = xss(req.body); // same logic with previous

            if (!xss(commentInfo)) {
                res.status(400).json({error: 'System requires you to provide a comment ID to complete the search operation'});
                return;
            }

            if (!xss(commentInfo.id)) {
                res.status(400).json({error: 'You must provide an ID for your comment'});
                return;
            }
            if (!xss(commentInfo.userName)) {
                res.status(400).json({error: 'You must provide an username for your comment'});
                return;
            }
            if (!xss(commentInfo.comment)) {
                res.status(400).json({error: 'You must provide the content of your comment'});
                return;
            }
        } catch (e) {
            res.status(400).json({error: e});
            return;
        }

        try {
            await commentData.getComment(xss(req.params.id));
        } catch (e) {
            res.status(404).json({error: 'Comment Not Found'})
        }

        try {
            const updateComment = await commentData.updateComment(xss(req.params.id), xss(commentInfo));  // Need a updateComment function in utils
            res.json(updateComment);
        } catch (e) {
            res.sendStatus(500);
        }
})
    .delete(async (req, res) => {
        try {
            utils.checkId(xss(req.params.id), ID);
        } catch (e) {
            return res.status(400).json({error: 'Invalid Input'});
        }

        try {
            await modelData.getComment(xss(req.params.id));
        } catch (e) {
            res.status(404).json({error: 'Comment Not Found'});
            return;
        }

        try {
            await commentData.removeComment(xss(req.params.id));
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(500);
        }
    })

module.exports = router;