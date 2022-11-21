const { model } = require("../data")

let user1 = {
    first_name: 'James',
    last_name: 'Robert',
    email: 'JamesR@gmail.com',
    gender: 'Male',
    location: 'NJ',
    organization: 'SIT',
    passwd: 'JamesR1914'
}

let user2 = {
    first_name: 'John',
    last_name: 'Michael',
    email: 'JohnM@gmail.com',
    gender: 'Male',
    location: 'NY',
    organization: 'NYU',
    passwd: 'JohnM1939'
}

let user3 = {
    first_name: 'Mary',
    last_name: 'Linda',
    email: 'MaryL@gmail.com',
    gender: 'Female',
    location: 'MA',
    organization: 'MIT',
    passwd: 'MaryL2019'
}

let model1 = {
    name: 'DNN',
    category: 'regression',
    description: 'Basic deep learning model for linear regression',
    link: 'https://github.com/oneapi-src/oneDNN',
    structure: 'dnn structure',
    input: 'feature size',
    output: '1',
    userId: undefined,
    dataId: undefined
}

let model2 = {
    name: 'vgg16',
    category: 'CV',
    description: 'Image classification for cat and dog.',
    link: 'https://github.com/msyim/VGG16',
    structure: 'vgg block',
    input: 'img size',
    output: '2',
    userId: undefined,
    dataId: undefined
}

let data1 = {
    name: 'Boston Housing Data',
    description: 'Concerns housing values in suburbs of Boston',
    features: ['CRIM', 'ZN', 'INDUS', 'CHAS', 'NOX', 'RM', 'AGE', 'DIS', 'RAD', 'TAX', 'PTRATIO', 'B', 'LSTAT', 'MEDV'],
    length: 506,
    source: 'http://lib.stat.cmu.edu/datasets/boston',
    file_path: '../raw_data/boston.json',
    userId: undefined
}

let data2 = {
    name: 'cat and dog',
    description: 'cat and dog dataset',
    features: ['image_base64_string', 'label'],
    length: 1000,
    source: 'https://www.kaggle.com/c/dogs-vs-cats',
    file_path: '../raw_data/cat.json',
    userId: undefined
}

module.exports = {
    user1,
    user2,
    user3,
    model1,
    model2,
    data1,
    data2
}