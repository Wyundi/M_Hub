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
    if (!id) throw `You must provide a ${varName}`;
    if (typeof id !== 'string') throw `${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
        throw `${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `${varName} invalid object ID`;

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

    As a general guideline, passwords should consist of 6 to 14 characters
    including one or more characters from each of the following sets:

    - Uppercase and lowercase letters (A-Z and a-z)

    - Numeric characters (0-9)

    - special character

    */

    passwd = checkString(passwd);

    if (passwd.includes(' ')) {
        throw "Password should not contain spaces.";
    }

    if (passwd.length < 6 || passwd.length > 14) {
        throw "Password should be at least 6 characters long.";
    }

    if (passwd.match(/[A-Z]+/g) === null) {
        throw "Password needs to be at least one uppercase character.";
    }

    if (passwd.match(/[0-9]+/g) === null) {
        throw "Password needs to be at least one number.";
    }

    if (passwd.match(/[^a-zA-Z0-9]+/g) === null) {
        throw "Password needs to be at least one special character.";
    }

    return passwd;
}

function checkStringArray(arr, varName) {

    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings

    let arrayInvalidFlag = false;

    if (!arr || !Array.isArray(arr))
        throw `You must provide an array of ${varName}`;
    for (i in arr) {
        if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
            arrayInvalidFlag = true;
            break;
        }
        arr[i] = arr[i].trim();
    }

    if (arrayInvalidFlag)
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
    return arr;

}

function checkUrl(url) {

    return url;
}

function checkPath(path) {

    return path;
}

// json
function checkJson(json_path) {

    json_obj = readJsonFile(json_path);

    return json_obj;
}

function readJsonFile(json_path) {

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

    username = checkString(username);
    
    if (username.match(/[^a-zA-Z0-9]+/g) !== null) {
        throw 'Username shoule not contain special characters.';
    }

    if (username.length < 4) {
        throw "Username too short.";
    }

    return username;
}

function prior(first_ele, second_ele) {
    return first_ele ? first_ele : second_ele;
}

function checkRawData(rawdata) {

    if (!rawdata || Object.keys(rawdata).length === 0) {
        throw "No files were uploaded.";
    }

    return rawdata;

}

function str2strArray(str) {

    str = checkString(str);

    // replace tab and space
    str = str.replace(/[\t\s]/g, '');

    // check spcial char
    if (str.match(/[^a-zA-Z0-9-_,]+/g)) {
        throw "Should not input special characters.";
    }

    // check comma
    if (str.match(/,,/) !== null) {
        throw 'More than one comma.';
    }

    return str.split(',');

}

function deleteFromArray(element, array) {
    let index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    } else throw 'ID not found in list.'
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

    readJsonFile,
    prior,

    checkRawData,
    str2strArray,
    deleteFromArray
}