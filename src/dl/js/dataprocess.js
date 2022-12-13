const data = require('../../data');
const dataInfoData = data.dataInfo;
const rawData = data.raw;

const onnx = require('onnxruntime-node');

const utils = require("../../utils");

const loadImg = async (dataId, index) => {

    dataId = utils.checkId(dataId, "data id");

    let data_db = await dataInfoData.getDataById(dataId);
    let raw = data_db.raw_data;

    if (index >= data_db.length) {
        throw "index out of range.";
    }

    index = index.toString();

    let img_path_db = await rawData.getDataById(raw['img_path'][index]);
    let img_path = img_path_db['data'];
    let label_db = await rawData.getDataById(raw['label'][index]);
    let label = label_db['data'];

    return {img_path, label};
};

const loadData = async (dataId, index, getNorm=false) => {

    dataId = utils.checkId(dataId, "data id");

    let data_db = await dataInfoData.getDataById(dataId);
    let raw = data_db.raw_data;

    if (index >= data_db.length) {
        throw "index out of range.";
    }

    let res = [];
    for (let key of Object.keys(raw)) {
        let single_data = await rawData.getDataById(raw[key][index.toString()]);
        res.push(single_data['data'])
    }

    if (getNorm) {
        let mean = data_db.mean;
        let std = data_db.std;

        let res_norm = [];
        for (let i in res) {
            res[i] = Number(res[i]);
            res_norm.push(res[i] - mean[i]) / std[i];
        }
        return {res, res_norm};
    }

    return res;

};

// const test = async () => {
//     let boston_id = '63978f000b4aab686772964b';

//     let {res, res_norm} = await loadData(boston_id, 1, getNorm=true);
//     console.log(res);
//     console.log(res_norm);

//     return 0;
// };

// const test = async () => {
//     let cat_id = '63978f000b4aab68677297de';

//     let res = await loadImg(cat_id, 1);

//     console.log(res.img_path);
//     console.log(res.label);

// };

// test();

module.exports = {
    loadData,
    loadImg

}