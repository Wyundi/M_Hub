const express = require('express');
const router = express.Router();
const user = require('../user');
const userData = user.data;

const path = require('path');
const utils = require('utils');

router
    .route('/')
    .get(async (req, res) => {})
    .post(async (req, res) => {})