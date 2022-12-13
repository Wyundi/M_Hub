// data = [
//     {feature: [14 * f], raw: [14 * raw_data]} * n
// ]

// data_norm = [
//     {feature: [14 * f], raw: [14 * raw_data]} * n
// ]
let dataset = []
features = ['f1', 'f2', 'f3']
data = [1, 2, 3]
for (i = 0; i <features.length; i++) {
    feature = features[i];
    let single_data = {[feature]: data[i]};
    dataset.push(single_data);
}

console.log(dataset)