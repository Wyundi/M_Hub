const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.user;

const xss = require('xss');

const path = require('path');
const utils = require('../utils');

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

        let userId = xss(req.session.user.userId);
        let user_db = undefined;
        let data_list = undefined;
        let model_list = undefined;

        try {
            user_db = await userData.getUserById(xss(userId));
            data_list = await userData.getDataList(xss(userId));
            model_list = await userData.getModelList(xss(userId));
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./userViews/profile", {
                time: time,
                username: xss(user_db.username),
                email: xss(user_db.email),
                location: xss(user_db.location),
                organization: xss(user_db.organization),
                data_list: data_list,
                model_list: model_list
            });
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
                error_status: error_status,
                error_message: e
            });
        }
    })

router
    .route('/user/edit')
    .get(async (req, res) => {

        let userId = xss(req.session.user.userId);
        let user_db = undefined;

        try {
            user_db = await userData.getUserById(xss(userId));
        } catch (e) {
            let error_status = 404;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
                error_status: error_status,
                error_message: e
            });
        }

        try {
            return res.status(200).render("./userViews/edit", {
                username: xss(user_db.username),
                first_name: xss(user_db.first_name),
                last_name: xss(user_db.last_name),
                email: xss(user_db.email),
                gender: xss(user_db.gender),
                location: xss(user_db.location),
                organization: xss(user_db.organization)
            })
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
                error_status: error_status,
                error_message: e
            });
        }
    })
    .post(async (req, res) => {

        let userId = xss(req.session.user.userId);
        let user_db = undefined;

        try {
            user_db = await userData.getUserById(xss(userId));
        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
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

        try {

            username = utils.checkUsername(utils.prior(xss(req.body.user_name), xss(user_db.username)));
            first_name = utils.checkString(utils.prior(xss(req.body.user_first_name), xss(user_db.first_name)));
            last_name = utils.checkString(utils.prior(xss(req.body.user_last_name), xss(user_db.last_name)));
            email = utils.checkEmail(utils.prior(xss(req.body.user_email), xss(user_db.email)));
            gender = utils.checkGender(utils.prior(xss(req.body.user_gender), xss(user_db.gender)));
            location = utils.checkLocation(utils.prior(xss(req.body.user_location), xss(user_db.location)));
            organization = utils.checkString(utils.prior(xss(req.body.user_organization), xss(user_db.organization)));

        } catch (e) {
            let error_status = 400;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
                error_status: error_status,
                error_message: e
            });
        }

        let newUser = undefined;
        try {
            newUser = {
                username: xss(username),
                first_name: xss(first_name),
                last_name: xss(last_name),
                email: xss(email),
                gender: xss(gender),
                location: xss(location),
                organization: xss(organization)
            }

            let updateStatus = await userData.updateUser(xss(userId), xss(newUser));

            return res.redirect("/user");
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
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
                username: xss(req.session.user.username),
                error_status: error_status,
                error_message: e
            });
        }
    })
    // post function post a form of user name and passward and go to user profile page
    .post(async (req, res) => {
        //code here for POST
        // error check
        let username = xss(req.body.user_name);
        let passwd = xss(req.body.user_password);

        try {
            username = utils.checkUsername(xss(username));
            passwd = utils.checkPasswd(xss(passwd));

            let check_status = await userData.checkUser(xss(username), xss(passwd));
            if (check_status.authenticatedUser) {
                let userId = check_status.authenticatedUser._id.toString();
                req.session.user = {
                    username: xss(username),
                    userId: xss(userId)
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
            if (xss(req.session.user)) {
                return res.redirect("/user");
            }
            else {
                return res.status(200).render("./userViews/signup");
            }
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
                error_status: error_status,
                error_message: e
            });
        }
    })
    // post function for create user and go to login page
    .post(async (req, res) => {

        let username = xss(req.body.user_name);
        let first_name = xss(req.body.user_first_name);
        let last_name = xss(req.body.user_last_name);
        let email = xss(req.body.user_email)
        let gender = xss(req.body.user_gender)
        let loc = xss(req.body.user_location)
        let org = xss(req.body.user_organization)
        let passwd = xss(req.body.user_password);

        try {
            // error check

            username = utils.checkUsername(xss(username));
            first_name = utils.checkString(xss(first_name));
            last_name = utils.checkString(xss(last_name));
            email = utils.checkEmail(xss(email));
            gender = utils.checkGender(xss(gender));
            loc = utils.checkLocation(xss(loc));
            org = utils.checkString(xss(org));

            passwd = utils.checkPasswd(xss(passwd));

            let user_info = {
                username: xss(username),
                first_name: xss(first_name),
                last_name: xss(last_name),
                email: xss(email),
                gender: xss(gender),
                location: xss(loc),
                organization: xss(org),
                passwd: xss(passwd),
            }

            const create_status = await userData.createUser(user_info);

            if (xss(create_status.insertedUser)) {
                return res.status(200).redirect("/login");
            }
            
        } catch (e) {
            let error_status = 500;
            return res.status(error_status).render("./error/errorPage", {
                username: xss(req.session.user.username),
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
                username: xss(req.session.user.username),
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
                username: xss(req.session.user.username),
                error_status: error_status,
                error_message: e
            });
        }   
    })

module.exports = router;