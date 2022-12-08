const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;

const path = require('path');
const utils = require('../utils');

router
    .route('/')
    .get(async (req, res) => {
        try {
            return res.sendFile(path.resolve('./static/homepage.html'));
        } catch (e) {
            return res.status(500).render('./error', {
                error_status: '500',
                error_message: "Server Error."
            })
        }    
    });

router
    .route('/user')
    // post function for create user
    .post(async (req, res) => {});

router
    .route('/user/:id')
    .get(async (req, res) => {})
    .post(async (req, res) => {})
    .put(async (req, res) => {})
    .delete(async (req, res) => {});

router
    .route('/login')
    // get function render a login page
    .get(async (req, res) => {
        if (req.session.user) {
            return res.redirect('')   // redirect to a logged-in page
        }
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
    .post(async (req, res) => {
        let username = req.body.user_name;
        let password = req.body.user_password;
        try {
            let user = await userData.checkUser(username, password);
            if (user) {
                req.session.user = {username: username};
                return res.redirect('')        //   redicted to logged-in page
            }
            // return res.sendFile(path.resolve('./static/login.html'));
        } catch (e) {
            return res.status(400).render('./error', {
                error_status: '400',
                error_message: "Error: " + e
            })
        }
    });

router
    .route('/signup')
    // get function render a signup page
    .get(async (req, res) => {
        if (req.session.user) {
            return res.redirect('')   // redirect to a logged-in page
        }
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
    .post(async (req, res) => {
        let username = req.body.user_name;
        let first_name = req.body.user_first_name;
        let last_name = req.body.user_last_name;
        let email = req.body.user_email;
        let gender = req.body.user_gender;
        let location = req.body.user_location;
        let organization = req.body.user_organization;
        let passwd = req.body.user_password;


        first_name = utils.checkString(first_name);
        last_name = utils.checkString(last_name);
        username = utils.checkUsername(username);
        email = utils.checkEmail(email);
        gender = utils.checkGender(gender);
        location = utils.checkLocation(location);
        organization = utils.checkString(organization);
    
        passwd = utils.checkPasswd(passwd);

        let user_info  = {
            username,
            first_name,
            last_name,
            email,
            gender,
            location,
            organization,
            passwd
        };
        try {
            let newUser = await userData.createUser(user_info);
            if (newUser) {
                return res.redirect('/login');
            }
        } catch (e) {
            if (e) {
                return res.status(400).render('userRegister', {title:'Register', error: '400', errorMessage:e });
              } else {
                return res.status(500).render('forbiddenAccess', {title: 'ForbiddenAccess', error: '500', errorMessage: 'Internal Server Error'});
              }
            /* 
            
            comtemporary rediction, need to change

            */
        }
    });

module.exports = router;