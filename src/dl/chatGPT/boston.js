const data = require('../../data');
const dataInfoData = data.dataInfo;
const rawData = data.raw;

const onnx = require('onnxruntime-node');

const utils = require("../../utils");

const loadData = async (dataId, index, getNorm=false) => {

    dataId = utils.checkId(dataId, "data id");

    let data_db = await dataInfoData.getDataById(dataId);
    let raw = data_db.raw_data;

    if (index >= data_db.length) {
        throw "index out of range.";
    }

    let res = [];
    for (let key of Object.keys(raw)) {
        let single_data = raw.getDataById(raw[key][index.toString()]);
        res.push(single_data)
    }

    if (getNorm) {
        let mean = data_db.mean;
        let std = data_db.std;

        let res_norm = [];
        for (let i in res) {
            res[i] = (res[i] - mean[i]) / std[i];
        }

        return res, res_norm;
    }

    return res;

};

async function runModel() {
  try {
    // Load the ONNX model for regression
    // const session = new onnx.InferenceSession();
    // await session.loadModel(modelFilePath);

    const session = await onnx.InferenceSession.create(modelFilePath);

    // Load the Boston Housing dataset
    const dataset = loadBostonHousingDataset();

    // Preprocess the dataset by normalizing the features
    const featureMeans = ndarray.mean(dataset.features, 0);
    const featureStds = ndarray.std(dataset.features, 0);
    ndarray.sub(dataset.features, featureMeans);
    ndarray.divseq(dataset.features, featureStds);

    // Use the preprocessed dataset as input to the model
    const inputTensors = {
      data: new onnx.Tensor(dataset.features.data, dataset.features.shape, 'float32'),
    };
    const outputTensors = await session.run(inputTensors);

    // Calculate the mean squared error between the predictions and the true values
    const predictions = outputTensors.predictions.data;
    const mse = ndarray.sum(ndarray.pow(ndarray.sub(predictions, dataset.labels), 2)) / dataset.labels.length;

    console.log('Mean squared error:', mse);
  } catch (err) {
    console.error('Error running model:', err);
  }
}

runModel();