const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;

const path = require('path');
const utils = require('../utils');
const { dataInfo } = require('../data');

router
    .route('/')
    .get(async (req, res) => {
        try {
            return res.sendFile(path.resolve('./static/homepage.html'));
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }    
    });

router
    .route('/user')
    // post function for create user
    .get(async (req, res) => {
        if (req.session.message) {
            window.onbeforeunload = function() {
                return req.session.message;
              };
        }

        time = new Date().toUTCString();

        let userId = req.session.user.userId;
        let user_db = undefined;
        let data_list = undefined;
        let model_list = undefined;

        try {
            user_db = await userData.getUserById(userId);
            data_list = await userData.getDataList(userId);
            model_list = await userData.getModelList(userId);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./userViews/profile", {
                time: time,
                username: user_db.username,
                email: user_db.email,
                location: user_db.location,
                organization: user_db.organization,
                data_list: data_list,
                model_list: model_list,
                message: req.session.message
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
    .post()

router
    .route('/user/edit')
    .get(async (req, res) => {

        let userId = req.session.user.userId;
        let user_db = undefined;

        try {
            user_db = await userData.getUserById(userId);
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./userViews/edit", {
                username: user_db.username,
                first_name: user_db.first_name,
                last_name: user_db.last_name,
                email: user_db.email,
                gender: user_db.gender,
                location: user_db.location,
                organization: user_db.organization
            })
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }
    })
    .put(async (req, res) => {

        let userId = req.session.user.userId;
        let user_db = undefined;

        try {
            user_db = await userData.getUserById(userId);
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        let username = undefined;
        let first_name = undefined;
        let last_name = undefined;
        let email = undefined;
        let gender = undefined;
        let location = undefined;
        let organization = undefined;
        let password = undefined;

        try {

            username = utils.checkUsername(utils.prior(req.body.user_name, user_db.username));
            first_name = utils.checkString(utils.prior(req.body.user_first_name, user_db.first_name));
            last_name = utils.checkString(utils.prior(req.body.user_last_name, user_db.last_name));
            email = utils.checkEmail(utils.prior(req.body.user_email, user_db.email));
            gender = utils.checkGender(utils.prior(req.body.user_gender, user_db.gender));
            location = utils.checkLocation(utils.prior(req.body.user_location, user_db.location));
            organization = utils.checkString(utils.prior(req.body.user_organization, user_db.organization));
            password = utils.checkPasswd(req.body.password);
            password = await userData.changePasswd(userId, user_db.passwd,password);

        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        let newUser = undefined;
        try {
            newUser = {
                username: username,
                first_name: first_name,
                last_name: last_name,
                email: email,
                gender: gender,
                location: location,
                organization: organization,
                password: password
            }

            let updateStatus = await userData.updateUser(userId, newUser);

            return res.redirect("/user");
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }
    })

// router
//     .route('/user/:id')
//     .get(async (req, res) => {})
//     .post(async (req, res) => {})
//     .put(async (req, res) => {})
//     .delete(async (req, res) => {});

router
    .route('/login')
    // get function render a login page
    .get(async (req, res) => {
        try {
            if (req.session.user) {
                res.redirect("/user");
            }
            else {
                return res.status(200).render("./userViews/login");
            }
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }
    })
    // post function post a form of user name and passward and go to user profile page
    .post(async (req, res) => {
        //code here for POST
        // error check
        let username = req.body.user_name;
        let passwd = req.body.user_password;

        try {
            username = utils.checkUsername(username);
            passwd = utils.checkPasswd(passwd);

            let check_status = await userData.checkUser(username, passwd);
            if (check_status.authenticatedUser) {
                let userId = check_status.authenticatedUser._id.toString();
                req.session.user = {
                    username: username,
                    userId: userId
                };
                res.redirect("./user");
            }
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                // username: username,
                error_status: error_status,
                error_message: e
            });
        }
    })

router
    .route('/signup')
    // get function render a signup page
    .get(async (req, res) => {
        try {
            if (req.session.user) {
                return res.redirect("/user");
            }
            else {
                return res.status(200).render("./userViews/signup");
            }
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }
    })
    // post function for create user and go to login page
    .post(async (req, res) => {

        let username = req.body.user_name;
        let first_name = req.body.user_first_name;
        let last_name = req.body.user_last_name;
        let email = req.body.user_email
        let gender = req.body.user_gender
        let loc = req.body.user_location
        let org = req.body.user_organization
        let passwd = req.body.user_password;

        try {
            // error check

            username = utils.checkUsername(username);
            first_name = utils.checkString(first_name);
            last_name = utils.checkString(last_name);
            email = utils.checkEmail(email);
            gender = utils.checkGender(gender);
            loc = utils.checkLocation(loc);
            org = utils.checkString(org);

            passwd = utils.checkPasswd(passwd);

            let user_info = {
                username: username,
                first_name: first_name,
                last_name: last_name,
                email: email,
                gender: gender,
                location: loc,
                organization: org,
                passwd: passwd,
            }

            const create_status = await userData.createUser(user_info);

            if (create_status.insertedUser) {
                return res.status(200).redirect("/login");
            }
            
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }
    });

router
    .route('/logout')
    .get(async (req, res) => {
        //code here for GET
        try {
            req.session.destroy();
            return res.status(200).render("./userViews/logout");
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }        
    })

router
    .route('/forbidden')
    .get(async (req, res) => {
        try {
            return res.status(200).render("./error/forbiddenAccess");
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