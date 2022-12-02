const express = require('express');
const router = express.Router();
const data = require('../data');
const modelData = data.model 
;

const path = require('path');
const utils = require('../utils');

router
    .route('/:id')
    .get(async (req, res) => {})
    .post(async (req, res) => {})
    .put(async (req, res) => {})
    .delete(async (req, res) => {})

module.exports = router;