const { model } = require("../data")

let user1 = {
    username: 'James1234',
    first_name: 'James',
    last_name: 'Robert',
    email: 'JamesR@gmail.com',
    gender: 'Man',
    location: 'NJ',
    organization: 'SIT',
    passwd: 'JamesR1914#'
}

let user2 = {
    username: 'Michael23',
    first_name: 'John',
    last_name: 'Michael',
    email: 'JohnM@gmail.com',
    gender: 'Man',
    location: 'NY',
    organization: 'NYU',
    passwd: 'JohnM1939#'
}

let user3 = {
    username: 'LindaM',
    first_name: 'Mary',
    last_name: 'Linda',
    email: 'MaryL@gmail.com',
    gender: 'Woman',
    location: 'MA',
    organization: 'MIT',
    passwd: 'MaryL2019#'
}

let data1 = {
    name: 'Boston Housing Data',
    type: 'data',
    description: 'Concerns housing values in suburbs of Boston',
    features: ['CRIM', 'ZN', 'INDUS', 'CHAS', 'NOX', 'RM', 'AGE', 'DIS', 'RAD', 'TAX', 'PTRATIO', 'B', 'LSTAT', 'MEDV'],
    length: 506,
    source: 'http://lib.stat.cmu.edu/datasets/boston',
    file_path: './raw_data/boston.json',
    userId: undefined,
    modelId: undefined
}

let data2 = {
    name: 'cat and dog',
    type: 'img',
    description: 'cat and dog dataset',
    features: ['img_path', 'label'],
    length: 200,
    source: 'https://www.kaggle.com/c/dogs-vs-cats',
    file_path: './raw_data/cat.json',
    userId: undefined,
    modelId: undefined
}

let model1 = {
    name: 'DNN',
    category: 'regression',
    description: 'Basic deep learning model for linear regression',
    link: 'https://github.com/oneapi-src/oneDNN',
    onnx_path: './onnx/boston.onnx',
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
    onnx_path: './onnx/cat.onnx',
    input: 'img size',
    output: '2',
    userId: undefined,
    dataId: undefined
}

module.exports = {
    user1,
    user2,
    user3,
    data1,
    data2,
    model1,
    model2
}