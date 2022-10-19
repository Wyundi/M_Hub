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

module.exports = {

    // error check
    checkInputExists,
    checkInputType,
    checkStringEnpty,
    checkValidName,
    checkInt

}