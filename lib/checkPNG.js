const _ = require("lodash");
const Jimp = require("jimp");
const path = require("path");
const { thumbsPath } = require("./getTemplates.js");

function getAlphaInfos(filePath) {
  return new Promise((resolve, reject) => {
    var areaAlpha = [];
    var countRow = 0;
    var countCol = 0;
    var lastY, lastIndex, lastX;
    var imageIndex = 0;

    Jimp.read(filePath, function(err, image) {
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(
        x,
        y,
        idx
      ) {
        var alpha = this.bitmap.data[idx + 3];

        if (alpha === 0) {
          // Perform checks
          if (distanceTo({ x: x, y: y }, { x: lastX, y: lastY }) > 2) {
            if (
              distanceTo(
                { x: x, y: y },
                {
                  x: areaAlpha[imageIndex][countRow][0].x,
                  y: areaAlpha[imageIndex][countRow][0].y
                }
              ) > 2
            ) {
              imageIndex = findIndexArray(x, y, areaAlpha);
            }
          }

          if (lastIndex !== imageIndex) {
            if (typeof areaAlpha[imageIndex] === "undefined") {
              lastY = undefined;
              countCol = 0;
              countRow = 0;
              areaAlpha[imageIndex] = new Array();
              areaAlpha[imageIndex][countRow] = new Array();
            } else {
              countRow = areaAlpha[imageIndex].length - 1;
              countCol = areaAlpha[imageIndex][countRow].length - 1;

              lastY = areaAlpha[imageIndex][countRow][countCol].y;
            }
          }

          if (lastY !== y && lastY !== undefined) {
            countRow = countRow + 1;
            countCol = 0;
            areaAlpha[imageIndex][countRow] = new Array();
          }

          areaAlpha[imageIndex][countRow][countCol] = { x: x, y: y };
          countCol = countCol + 1;

          lastY = y;
          lastX = x;
          lastIndex = imageIndex;
        }
      });

      resolve(areaAlpha);
    });
  });
}

function getMockupInfos(filePath) {
  return new Promise((resolve, reject) => {
    Jimp.read(filePath, function(err, image) {
      resolve({
        width: image.bitmap.width,
        height: image.bitmap.height,
        x: 0,
        y: 0
      });
    });
  });
}

function extractData(data) {
  return {
    width: data[0].length,
    height: data.length,
    x: data[0][0].x,
    y: data[0][0].y
  };
}

function generatePreviewImages(data, filePath, name) {
  return new Promise((resolve, reject) => {
    let color = Jimp.rgbaToInt(80, 227, 194, 255);
    Jimp.read(filePath, function(err, image) {
      image.brightness(-0.8);

      for (let i = 0; i < data.length; i++) {
        for (let a = 0; a < data[i].length; a++) {
          image.setPixelColor(
            color,
            parseInt(data[i][a].x),
            parseInt(data[i][a].y)
          );
        }
      }

      image.write(`${thumbsPath}/${name}.png`);

      const objData = Object.assign(extractData(data), {
        path: `${thumbsPath}/${name}.png`
      });
      resolve(objData);
    });
  });
}

function getImageData(alphaInfo, filePath) {
  return new Promise((resolve, reject) => {
    let pathFile = [];

    for (let i = 0; i < alphaInfo.length; i++) {
      const name = `${path.basename(filePath).slice(0, -4)}-${i}`;
      pathFile.push(generatePreviewImages(alphaInfo[i], filePath, name));
    }

    Promise.all(pathFile).then(imagesData => {
      resolve(imagesData);
    });
  });
}

/* -----------
 Main Function
--------- */

function constructData(filePath) {
  return new Promise((resolve, reject) => {
    getAlphaInfos(filePath).then(alphaInfo => {
      let promises = [
        getMockupInfos(filePath),
        getImageData(alphaInfo, filePath)
      ];
      Promise.all(promises).then(values => {
        const mockupObj = values[0];
        const imageObj = values[1];

        resolve({
          mockup: mockupObj,
          images: imageObj
        });
      });
    });
  });
}

module.exports = {
  getImageInfo: constructData
};

/* -----------
 Helpers
--------- */

function distanceTo(from, to) {
  var distance = Math.sqrt(
    Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)
  );
  return distance;
}

function findIndexArray(x, y, areaAlpha) {
  let imageIndex = areaAlpha.length;

  areaAlpha.forEach((obj, i) => {
    let arrCheck = _.flatten(obj[[obj.length - 1]]);

    let maxY = _.maxBy(arrCheck, function(o) {
      return o.y;
    });
    let maxX = _.maxBy(arrCheck, function(o) {
      return o.x;
    });

    let arrDist = [
      distanceTo(maxY, { x: x, y: y }),
      distanceTo(maxX, { x: x, y: y })
    ];

    if (Math.min(...arrDist) < 2) {
      imageIndex = i;
    }
  });

  return imageIndex;
}
