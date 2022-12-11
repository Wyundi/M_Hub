const {ObjectId} = require('mongodb');

// hashing passwd
const bcrypt = require("bcrypt");
const saltRounds = 6;

// read file
const path = require('path');
const fs = require('fs');

// error check

function checkInputExists(input) { // check parameter exists
    if (input == undefined) {
        throw 'input does not exist';
    }
}

function checkInputType(input, type) {
    if (type === 'array') {
        if (!Array.isArray(input)) {
            throw 'provided input is not an array';
        }
    }
    else if (type === 'object') {
        if (Array.isArray(input)) {
            throw 'provided input is an array';
        }
        else if (typeof(input) !== 'object') {
            throw 'provided input is not an object';
        }
    }
    else {
        if (typeof(input) !== type) {
            throw `provided input is not a ${type}`;
        }
    }
}

function checkStringEnpty(str) {
    str = str.trim();
    if (str.length == 0) {
        throw 'provided input string is empty';
    }
}

function checkValidName(name, reg) {

    name_standard = name.replace(reg, "");

    if (name_standard !== name) {
        throw 'name should has no numbers or special characters or punctuation'
    }

    let space_num = 0;
    for (ele of name) {
        if (ele === ' ') {
            space_num++;
        }
    }

    if (space_num > 1) {
        throw 'more than one space in name';
    }

    name_lst = name.split(' ');
    first_name = name_lst[0];
    last_name = name_lst[1];

    if (first_name.length < 3) {
        throw 'first name should be at least 3 characters';
    }

    if (last_name.length < 3) {
        throw 'last name should be at least 3 characters';
    }

}

function checkInt(num) {

    if (num % 1 !== 0) {
        throw 'num is not integer';
    }

    return num;

}

function checkString(str) {
    
    checkInputExists(str);
    checkInputType(str, 'string');
    checkStringEnpty(str);

    return str.trim();

}

function checkEmail(email) {

    // 

    email = checkString(email);

    return email;
}

function checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;

    return id;
}

function checkGender(gender) {

    // ["male", "female"]

    gender = checkString(gender);

    return gender;
}

function checkLocation(loc) {

    loc = checkString(loc);

    return loc;
}

function checkPasswd(passwd) {

    /*

    As a general guideline, passwords should consist of 8 to 14 characters
    including one or more characters from each of the following sets:

    - Uppercase and lowercase letters (A-Z and a-z)

    - Numeric characters (0-9)

    */

    passwd = checkString(passwd);

    return passwd;
}

function checkStringArray(arr) {

    return arr;
}

function checkUrl(url) {

    return url;
}

function checkPath(path) {

    return path;
}

function checkJson(json_path) {

    json_obj = readJsonFile(json_path);

    return json_obj;
}

// hash passwd
function hash(passwd) {

    passwd = checkPasswd(passwd);
    const hashedPasswd = bcrypt.hash(passwd, saltRounds);;

    return hashedPasswd;
}

// json
function readJsonFile(json_path) {
    
    // fake json object for test
    // json_obj = {
    //     "feature1": {
    //         "0": 0.25,
    //         "1": 0.7
    //     },
    //     "feature2": {
    //         "0": 0.23,
    //         "1": 0.56
    //     },
    //     "target": {
    //         "0": 1,
    //         "1": 0
    //     }
    // }

    let json_string = undefined;
    let json_obj = undefined;
    try {
        json_string = fs.readFileSync(path.resolve(json_path), 'utf8');
        json_obj = JSON.parse(json_string);
    } catch (e) {
        throw `failed to read json file: ${e}`;
    }

    console.log(`read file ${json_path} successfully.`);

    return json_obj;
}

function checkUsername(username) {

    const regUsername = /[a-zA-Z\d ]+/g;
    if (typeof username !== 'string') throw 'Error: username should be a string';
    username = username.trim();
    if (username.length < 4) throw 'Error: usermane should be at least 4 characters long';
    let regReslt = username.replace(regUsername, '');
    if (!regReslt.length === 0) throw 'Error: username only include alphanumeric characters';
    username = username.toLowerCase();
    return username;
}

function checkComment(comment) {
    if (!comment) throw `Error: You must provide a comment`;
    if (typeof comment !== 'string') throw `Error: comment must be a string`;
    comment = comment.trim();
    if (comment.length == 0) throw 'Error: comment cannot be empty';
    const pattern = /^[\p{S}\p{N}\p{P}\s]+$/gu;
    if (comment.match(pattern)) throw 'Error: comment cannot only contain punctuation or special character or numbers.';
    return comment;
}

function checkModelName(modelName) {
    if (!modelName) throw `Error: You must provide a model name`;
    if (typeof modelName !== 'string') throw `Error: model name must be a string`;
    modelName = modelName.trim();
    if (modelName.length == 0) throw 'Error: model name cannot be empty';
    const pattern = /\p{S}/gu;
    if (modelName.match(pattern)) throw 'Error: model name cannot contain special characters';
    return modelName;
}

function checkModelCategory(modelCategory) {
    if (!modelCategory) throw `Error: You must provide a model category`;
    if (typeof modelCategory !== 'string') throw `Error: model category must be a string`;
    modelCategory = modelCategory.trim();
    if (modelCategory.length == 0) throw 'Error: model category cannot be empty';
    const pattern = /\p{S}|\p{P}|\p{N}/gu;
    if (modelCategory.match(pattern)) throw 'Error: model category cannot contain special characters, punctuations or numbers';
    return modelCategory;
}

function checkModelDescription(description) {
    if (!description) throw `Error: You must provide a model description`;
    if (typeof description !== 'string') throw `Error: model description must be a string`;
    description = description.trim();
    if (description.length == 0) throw 'Error: model description cannot be empty';
    const pattern = /^[\p{S}\p{N}\p{P}\s]+$/gu;
    if (description.match(pattern)) throw 'Error: model description cannot only contain punctuation or special character or numbers.';
    return description;
}

function checkStringPattern(str, pattern, varName) {
    if (!str) throw `Error: You must provide ${varName}`;
    if (typeof str !== 'string') throw `Error: ${varName} must be string`;
    str = str.trim();
    if (str.length == 0) throw `Error: ${varName} length cannot be 0`;
    const pattern1 = /^[\p{S}\p{N}\p{P}\s]+$/gu;
    if (str.match(pattern1)) throw `Error: ${varName} cannot only contain punctuation or special character or numbers.`;
    if (str.match(pattern)) throw `Error: ${varName} contains illegal characters.`;
    return str;
}

function checkModelLink(link, varName) {
    if (!link) throw `Error: You must provide ${varName}`;
    if (typeof link !== 'string') throw `Error: ${varName} must be string`;
    link = link.trim();
    if (link.length == 0) throw `Error: ${varName} length cannot be 0`;
    const Expression =  /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
    if (RegExp(Expression).test(link)) throw `Error: ${varName} is not a valid link`;
    return link;
}


module.exports = {

    // error check
    checkInputExists,
    checkInputType,
    checkStringEnpty,
    checkValidName,
    checkInt,
    checkString,

    checkEmail,
    checkId,
    checkGender,
    checkLocation,
    checkPasswd,

    checkStringArray,
    checkUrl,
    checkPath,
    checkJson,
    checkUsername,
    checkComment,

    checkModelName,
    checkModelCategory,
    checkModelDescription,
    checkStringPattern,
    checkModelLink,

    // other help function
    hash,
    readJsonFile,
}