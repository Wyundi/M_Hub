const userData = require('./user');
const modelData = require("./model");
const dataInfoData = require('./dataInfo');
const commentData = require('./comment');
const rawData = require("./raw");

module.exports = {
    user: userData,
    model: modelData,
    comment: commentData,
    dataInfo: dataInfoData,
    raw: rawData
};