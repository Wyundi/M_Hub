const userData = require('./user');
const modelData = require("./model");
const commentData = require("./comment");
const dataInfoData = require('./dataInfo');
const rawData = require("./raw");

module.exports = {
    user: userData,
    model: modelData,
    comment: commentData,
    dataInfo: dataInfoData,
    raw: rawData
};