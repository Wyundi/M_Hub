const express = require('express');
const router = express.Router();

const path = require('path');
const utils = require('../utils');

router
    .route('/')
    // get function should display a list of current data / model or user
    .get(async (req, res) => {})
    // post function should show search result
    .post(async (req, res) => {})

router
    .route('/user')
    
    .post(async (req, res) => {})

module.exports = router;