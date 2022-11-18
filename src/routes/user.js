const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;

const path = require('path');
const utils = require('../utils');

router
    .route('/:id')
    .get(async (req, res) => {})
    .post(async (req, res) => {})
    .put(async (req, res) => {})
    .delete(async (req, res) => {});

router
    .route('/login')
    // get function render a login page
    .get(async (req, res) => {
        try {
            return res.sendFile(path.resolve('./static/login.html'));
        } catch (e) {
            return res.status(500).render('./error', {
                error_status: '500',
                error_message: "Server Error."
            })
        }
    })
    // post function post a form of user name and passward and go to user profile page
    .post(async (req, res) => {});

router
    .route('/signup')
    // get function render a signup page
    .get(async (req, res) => {
        try {
            return res.sendFile(path.resolve('./static/signup.html'));
        } catch (e) {
            return res.status(500).render('./error', {
                error_status: '500',
                error_message: "Server Error."
            })
        }
    })
    // post function post a form of user info and go to user profile page
    .post(async (req, res) => {});

module.exports = router;