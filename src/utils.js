const {ObjectId} = require('mongodb');

// hashing passwd
const bcrypt = require("bcrypt")

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

// hash passwd
function hash(passwd) {

    passwd = checkPasswd(passwd);
    hashedPasswd = passwd;

    return hashedPasswd;
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
    hash,
}