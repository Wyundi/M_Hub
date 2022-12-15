const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');

const data = mongoCollections.data;
const dataData = require("./data");

const model = mongoCollections.model;
const modelData = require("./model");

const utils = require("../utils");

const createComment = async (
    id,
    userName,
    comment
    // date should be current date
) => {
    modelId = utils.checkId(id, 'comment id');
    username = utils.checkUsername(userName);
    comment = utils.checkComment(comment);

    const date = new Date();
    commentDate = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();

    const commentId = new ObjectId();

    let newComment = {
        _id: commentId,
        comment: comment,
        commentDate: commentDate,
        username: username
    }

    const modelCollection = await model();
    const modelData = await modelCollection.findOne({_id: ObjectId(modelId)});
    if (modelData === null) throw `Error: no movie with id ${modelId}`;
    modelData['comments'].push(newComment);

    const updatedInfo = await modelCollection.updateOne(
        {_id: ObjectId(modelId)},
        {$set: modelData}
    );
    if (updatedInfo.modifiedCount === 0) throw `Error: Could not update the review of that movie`;
    newComment['_id'] = newComment['_id'].toString();
    return newComment;
};

const getAllComment = async (id) => {
    modelId = utils.checkId(id, 'model id');

    const modelCollection = await model(); 
    const modelData = await modelCollection.findOne({_id: ObjectId(modelId)});
    if (modelData === null) throw `Error: no movie with id ${modelId}`;
    modelObj['comments'].forEach(element => {
        element._id = element._id.toString();
    });

    return modelObj['comment'];
};

const getComment = async (commentId) => {
    commentId = utils.checkId(commentId);

    const modelCollection = await model();
    const modelObj = await modelCollection.find({"comments._id": ObjectId(commentId)}).toArray();
    if (modelObj === null) throw `Error: no comment exists with that id.`;
     
    let comments= modelObj[0]['comments'];
    comments.forEach(element =>{
      element._id = element._id.toString();
    })
    for (let i of comments) {
      if (i['_id'] == commentId) {
        return i;
      }
    };
};

const removeComment = async (commentId) => {
    commentId = utils.checkId(commentId);

    const modelCollection = await model();
    const modelObj = await modelCollection.find({'comments._id': ObjectId(commentId)}).toArray();
    if (modelObj === null) throw `Error: no comment exists with that id.`;

    const modelId = modelObj[0]['_id'].toString();
    const commentsUpdated = await modelCollection.updateOne({'comments._id': ObjectId(commentId)}, {$pull: {comments: {_id: ObjectId(commentId)}}});
    if (commentsUpdated.modifiedCount == 0) throw `Error: cannot remove the comments for movie ${modelId}`;
    
    const updatedModels = await models();
    const updatedModel = await updatedModels.findOne({_id: ObjectId(modelId)});
    updatedModel.comments.forEach(element => {
        element._id = element._id.toString();
    });
    updatedModel._id = updatedModel._id.toString();

    return updatedModel;
};

module.exports = {
    createComment,
    getAllComment,
    getComment,
    removeComment
};
