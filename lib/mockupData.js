const fs = require('fs')
const path = require('path')
const { getImageInfo } = require('./checkPNG.js')
const {
  getAllTemplatesFiles,
  userDataPath,
  thumbsPath,
  mockupsPath,
  getLoadTemplateObj,
} = require('./getTemplates.js')


/*
  Render PNG
*/
function renderPNG(filePath) {
  return new Promise((resolve, reject) => {
    const fileName = '_temp'

    getImageInfo(filePath).then((mockData) => {
      mockData.mockup.path = filePath
      mockData.name = path.basename(filePath).slice(0, -4)
      mockData.category = 'default'

      saveMockup(fileName, mockData)

      setTimeout(() => { resolve() }, 500)
    })
  })
}

/*
  Delete Temp File
*/
function deleteTempJson() {
  fs.unlinkSync(`${userDataPath}/templates/_temp.json`)
}

/*
  Save File
*/
function saveMockup(fileName, mockData) {
  console.log(mockData)
  fs.writeFileSync(`${userDataPath}/templates/${fileName}.json`, JSON.stringify(mockData, null, 2))
}

/*
  Copy Image
*/
function copyMockupFile(filePath) {
  let readStream = fs.createReadStream(filePath);
  let fileName = path.basename(filePath)

  readStream.once('error', (err) => {
    console.log(err);
  });
  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(`${mockupsPath}/${fileName}`));
  return `${mockupsPath}/${fileName}`
}

/*
  Clear
*/
function cleanTempFiles(obj) {
  //se temp nao existir return

}


module.exports = {
  renderPNG,
  saveMockup,
  cleanTempFiles,
  copyMockupFile,
  deleteTempJson
}
