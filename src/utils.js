/*

checkEmail                  //Qingyao
checkGender

checkUrl
checkPath

*/



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

    email = checkString(email);
    email = email.toLowerCase();
    // all email should be converted into lower for deduplication and some other purpose

    const result = email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!result) {
        throw "Your inputed email is invalid"
    }

    return email; // depend on how we want this to work, this could be return or not
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
    // according to the professor, gender should be not only male and femail, but also included some other opbtions

    const options = ["male", "female", "transmale", "transfemale", "dengerqueer", "something else", "decline to answer"];

    gender = checkString(gender);
    gender = gender.toLowerCase();

    if (!options.includes(gender)) {
        throw "the gender you provide is not valid, please try again";
    }

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

    // haven't consider special character ralated cases

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
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if (!!pattern.test(url)) throw "Invalid URL"
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

    username = checkString(username);
    
    if (username.match(/[^a-zA-Z0-9]+/g) !== null) {
        throw 'Username shoule not contain special characters.';
    }

    if (username.length < 4) {
        throw "Username too short.";
    }

    return username;
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

    // other help function
    hash,
    readJsonFile,
}