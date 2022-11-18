const express = require('express');
const router = express.Router();

const path = require('path');
const utils = require('utils');

router
    .route('/search')
    // get function should display a list of current data / model or user
    .get(async (req, res) => {})
    // post function should show search result
    .post(async (req, res) => {})