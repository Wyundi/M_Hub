const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');

const dataInfo = mongoCollections.dataInfo;
// const dataData = require("./data");

const model = mongoCollections.model;
// const modelData = require("./model");

const utils = require("../utils");

const createComment = async (
    id,
    userName,
    comment,
    target
    // date should be current date
) => {

    id = utils.checkId(id, 'id');
    username = utils.checkUsername(userName);
    comment = utils.checkString(comment);

    const date = new Date();
    commentDate = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();

    const commentId = new ObjectId();

    let newComment = {
        _id: commentId,
        comment: comment,
        commentDate: commentDate,
        username: username
    }

    if (target == 'model') {
        const modelCollection = await model();
        const modelObj = await modelCollection.findOne({_id: ObjectId(id)});
        if (modelObj === null) throw `Error: no model with id ${id}`;
        modelObj['comment'].push(newComment);
    
        updatedInfo = await modelCollection.updateOne(
            {_id: ObjectId(id)},
            {$set: modelObj}
        ); 
    } else if (target == 'data') {
        const dataCollection = await dataInfo();
        const dataObj = await dataCollection.findOne({_id: ObjectId(id)});
        if (dataObj === null) throw `Error: no model with id ${id}`;
        dataObj['comment'].push(newComment);
    
        updatedInfo = await dataCollection.updateOne(
            {_id: ObjectId(id)},
            {$set: dataObj}
        ); 
    }

    if (updatedInfo.modifiedCount === 0) throw `Error: Could not update the review of that ${target}`;
    newComment['_id'] = newComment['_id'].toString();
    return newComment;
};

const getAllComment = async (id, target) => {
    id = utils.checkId(id, 'id');

    if (target == 'model') {
        const modelCollection = await model(); 
        const modelData = await modelCollection.findOne({_id: ObjectId(id)});
        if (modelData === null) throw `Error: no model with id ${id}`;
        modelData['comment'].forEach(element => {
            element._id = element._id.toString();
        });
        return modelData['comment'];

    } else if (target == 'data') {
        const dataCollection = await dataInfo(); 
        const dataObj = await dataCollection.findOne({_id: ObjectId(id)});
        if (dataObj === null) throw `Error: no model with id ${id}`;
        dataObj['comment'].forEach(element => {
            element._id = element._id.toString();
        });
        return dataObj['comment'];
    }


};

const getComment = async (commentId, target) => {
    commentId = utils.checkId(commentId);

    if (target == 'model') {
        const modelCollection = await model();
        const modelObj = await modelCollection.find({"comment._id": ObjectId(commentId)}).toArray();
        if (modelObj === null) throw `Error: no comment exists with that id.`;
        comments= modelObj[0]['comment'];
    } else if (target == 'data') {
        const dataCollection = await dataInfo();
        const dataObj = await dataCollection.find({"comment._id": ObjectId(commentId)}).toArray();
        if (dataObj === null) throw `Error: no comment exists with that id.`;
        comments= dataObj[0]['comment'];
    }
    
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
    const modelObj = await modelCollection.find({'comment._id': ObjectId(commentId)}).toArray();
    if (modelObj === null) throw `Error: no comment exists with that id.`;

    const modelId = modelObj[0]['_id'].toString();
    const commentsUpdated = await modelCollection.updateOne({'comment._id': ObjectId(commentId)}, {$pull: {comment: {_id: ObjectId(commentId)}}});
    if (commentsUpdated.modifiedCount == 0) throw `Error: cannot remove the comments for movie ${modelId}`;
    
    const updatedModels = await models();
    const updatedModel = await updatedModels.findOne({_id: ObjectId(modelId)});
    updatedModel.comment.forEach(element => {
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
