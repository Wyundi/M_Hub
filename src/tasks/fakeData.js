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
    gender: 'Prefer not to respond',
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

let user4 = {
    username: 'Tyler345',
    first_name: 'Tyler',
    last_name: 'kadi',
    email: 'Tyler563@gmail.com',
    gender: 'Man',
    location: 'NJ',
    organization: 'Trenton',
    passwd: 'JTyler@1998'
}

let user5 = {
    username: 'Emily222',
    first_name: 'Emily ',
    last_name: 'Miller',
    email: 'eMiller20@gmail.com',
    gender: 'Transgender',
    location: 'PA',
    organization: 'PennState',
    passwd: 'EMiller@222'
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

let modelComment1 = {
    userName: "LindaM",
    comment: "Nice Work! I like this one."
}

let modelComment2 = {
    userName: "Michael23",
    comment: "Meh, average work."
}

let modelComment3 = {
    userName: "James1234",
    comment: "Cool Concept!"
}
let modelComment4 = {
    userName: "Tyler345",
    comment: "Helps a lot! Thanks!"
}
let modelComment5 = {
    userName: "Tyler345",
    comment: "Really cool model! I like the idea behind it!"
}
let modelComment6 = {
    userName: "Emily222",
    comment: "Like this model!"
}
let modelComment7 = {
    userName: "Emily222",
    comment: "Great model!"
}

let dataComment1 = {
    userName: "Michael23",
    comment: "Clean data! Ready to work!"
}

let dataComment2 = {
    userName: "Michael23",
    comment: "Messy data, need more work done!"
}

module.exports = {
    user1,
    user2,
    user3,
    user4,
    user5,
    data1,
    data2,
    model1,
    model2,
    modelComment1,
    modelComment2,
    modelComment3,
    modelComment4,
    modelComment5,
    modelComment6,
    modelComment7,
    dataComment1,
    dataComment2
}