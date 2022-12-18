const fs = require('fs');
const jpeg = require('jpeg-js');
const sharp = require('sharp');

const path = require('path');

const readImg = async (img_path, resize=false) => {
    // Read the image file into a buffer
    // Decode the JPEG data to get raw pixel data
    let sharp_img = await sharp(path.resolve(img_path));

    if (resize) {
        sharp_img = await sharp_img.resize(224,224).toBuffer();
    }
    else {
        sharp_img = await sharp_img.toBuffer();
    }
    
    data = jpeg.decode(sharp_img, {useTArray: true});

    // The pixel data is stored as a 1D array (data.data) of 8-bit integers,
    // where each pixel is represented by 4 consecutive integers (for the red,
    // green, blue, and alpha channels).

    const pixels = data.data;
    const width = data.width;
    const height = data.height;

    // Convert the 1D array to a 2D array (list of lists)
    const pixelRows = [];
    for (let i = 0; i < height; i++) {
    const start = i * width * 4;
    const end = start + width * 4;
    const row = pixels.slice(start, end);
    pixelRows.push(row);
    }

    // Convert the 2D array to a 3D array (list of lists of lists)
    const pixelPlanes = [];
    for (let i = 0; i < height; i++) {
        const plane = [];
        for (let j = 0; j < width; j++) {
            const start = (i * width + j) * 4;
            const end = start + 3;                                  // 4 channel, red, green, blue, and alpha. Only get RGB here.
            const pixel = pixels.slice(start, end);
            plane.push([...pixel]);
        }
        pixelPlanes.push(plane);
    }

    // Convert the 8-bit integer values to floating point values
    const floatPlanes = pixelPlanes.map(plane => plane.map(row => row.map(value => value / 255)));

    // console.log(floatPlanes);  // The 3D array of floating point pixel values
    // console.log(floatPlanes.length + ', ' + floatPlanes[0].length + ', ' + floatPlanes[0][0].length);

    let res = {
        img_data: floatPlanes,
        img_height: floatPlanes.length,
        img_width: floatPlanes[0].length,
        img_channel: floatPlanes[0][0].length
    }

    return res;
};

module.exports = {
    readImg,
}