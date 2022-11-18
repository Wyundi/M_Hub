const { model } = require("../data")

let user1 = {
    first_name: 'James',
    last_name: 'Robert',
    email: 'JamesR@gmail.com',
    gender: 'Male',
    location: 'NJ',
    organization: 'SIT',
    password: 'JamesR1914'
}

let user2 = {
    first_name: 'John',
    last_name: 'Michael',
    email: 'JohnM@gmail.com',
    gender: 'Male',
    location: 'NY',
    organization: 'NYU',
    password: 'JohnM1939'
}

let user3 = {
    first_name: 'Mary',
    last_name: 'Linda',
    email: 'MaryL@gmail.com',
    gender: 'Female',
    location: 'MA',
    organization: 'MIT',
    password: 'MaryL2019'
}

let data1 = {
    name: 'Boston Housing Data',
    description: 'Concerns housing values in suburbs of Boston',
    features: ['CRIM', 'ZN', 'INDUS', 'CHAS', 'NOX', 'RM', 'AGE', 'DIS', 'RAD', 'TAX', 'PTRATIO', 'B', 'LSTAT', 'MEDV'],
    length: 506,
    source: 'https://www.kaggle.com/code/prasadperera/the-boston-housing-dataset',
    file_path: '../raw_data/boston.json'
}

let data2 = {
    name: 'cat and dog',
    description: 'cat and dog dataset',
    features: ['img', 'label'],
    length: 1000,
    source: 'https://www.kaggle.com/c/dogs-vs-cats',
    file_path: '../raw_data/cat.json'
}

module.exports = {
    user1,
    user2,
    user3,
    model1,
    data1,
}