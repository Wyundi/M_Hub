const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;

const path = require('path');
const utils = require('../utils');

const xss = require('xss');

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

        let userId = undefined;
        let user_db = undefined;

        try {
            userId = utils.checkId(xss(req.session.user.userId), "user id");
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            user_db = await userData.getUserById(userId);
        } catch (e) {
            let error_status = 502;
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

            username = utils.checkUsername(utils.prior(xss(req.body.user_name), user_db.username));
            first_name = utils.checkString(utils.prior(xss(req.body.user_first_name), user_db.first_name));
            last_name = utils.checkString(utils.prior(xss(req.body.user_last_name), user_db.last_name));

            let full_name = first_name + ' ' + last_name;
            full_name = utils.checkValidName(xss(full_name));

            email = utils.checkEmail(utils.prior(xss(req.body.user_email), user_db.email));
            gender = utils.checkGender(utils.prior(xss(req.body.user_gender), user_db.gender));
            location = utils.checkLocation(utils.prior(xss(req.body.user_location), user_db.location));
            organization = utils.checkString(utils.prior(xss(req.body.user_organization), user_db.organization));

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
                organization: organization
            }

            let updateStatus = await userData.updateUser(userId, newUser);
            req.session.user.username = username;
        } catch (e) {
            let error_status = 502;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).redirect("/user");
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
    .route('/user/edit/changepasswd')
    .get(async (req, res) => {
        let username = req.session.user.username;

        try {
            return res.status(200).render("./userViews/changePasswd");
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: username,
                error_status: error_status,
                error_message: e
            });
        }
        
    })
    .post(async (req, res) => {

        let userId = req.session.user.userId;

        let old_passwd = undefined;
        let new_passwd = undefined;

        try {
            old_passwd = utils.checkPasswd(xss(req.body.user_old_passwd));
            new_passwd = utils.checkPasswd(xss(req.body.user_new_passwd));
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            let state_message = await userData.changePasswd(userId, old_passwd, new_passwd);
        } catch (e) {
            let error_status = 502;
            return res.status(error_status).render("./error/errorPage", {
                username: req.session.user.username,
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).redirect("/user");
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
                error_status: error_status,
                error_message: e
            });
        }
    })
    // post function post a form of user name and passward and go to user profile page
    .post(async (req, res) => {

        // error check
        let username = undefined;
        let passwd = undefined;

        try {
            username = utils.checkUsername(xss(req.body.user_name));
            passwd = utils.checkPasswd(xss(req.body.user_password));

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
                error_status: error_status,
                error_message: e
            });
        }
    })
    // post function for create user and go to login page
    .post(async (req, res) => {

        let username = undefined;
        let first_name = undefined;
        let last_name = undefined;
        let email = undefined;
        let gender = undefined;
        let loc = undefined;
        let org = undefined;
        let passwd = undefined;

        try {
            // error check

            username = utils.checkUsername(xss(req.body.user_name));
            first_name = utils.checkString(xss(req.body.user_first_name));
            last_name = utils.checkString(xss(req.body.user_last_name));

            let full_name = first_name + ' ' + last_name;
            full_name = utils.checkValidName(xss(full_name));
            
            email = utils.checkEmail(xss(req.body.user_email));
            gender = utils.checkGender(xss(req.body.user_gender));
            loc = utils.checkLocation(xss(req.body.user_location));
            org = utils.checkString(xss(req.body.user_organization));
            passwd = utils.checkPasswd(xss(req.body.user_password));

        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                error_status: error_status,
                error_message: e
            });
        }

        try {
            // check if username already in database
        } catch (e) {
            let error_status = 502;
            return res.status(error_status).render("./error/errorPage", {
                error_status: error_status,
                error_message: e
            });
        }

        try {
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

            if (!create_status.insertedUser) {
                throw 'Failed to create user.';
            }

        } catch (e) {
            let error_status = 502;
            return res.status(error_status).render("./error/errorPage", {
                error_status: error_status,
                error_message: e
            });
        }
            
        try {
            return res.status(200).redirect("/login");
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
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