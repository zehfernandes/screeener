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
  if (fs.existsSync(`${userDataPath}/templates/_temp.json`)) {
    fs.unlinkSync(`${userDataPath}/templates/_temp.json`)
  }
}

/*
  Save File
*/
function saveMockup(fileName, mockData) {
  fs.writeFileSync(`${userDataPath}/templates/${fileName}.json`, JSON.stringify(mockData, null, 2))
}

/*
  Copy Image
*/
function copyMockupFile(filePath) {
  return new Promise((resolve, reject) => {
    let readStream = fs.createReadStream(filePath);
    let fileName = path.basename(filePath)

    readStream.once('error', (err) => {
      console.log(err);
    });
    readStream.once('end', () => {
      console.log('done copying');

      resolve(`${mockupsPath}/${fileName}`)
    });

    readStream.pipe(fs.createWriteStream(`${mockupsPath}/${fileName}`))
  })
}

/*
  Clear
*/
function cleanTempFiles(fileName) {
  let filePath = `${userDataPath}/templates/${fileName}`
  if (fs.existsSync(filePath)) {
    const content = require(filePath)
    if (!path.isAbsolute(content.mockup.path)) {
      content.mockup.path = path.join(`${userDataPath}/templates/`, content.mockup.path)
    }

    content.images.map((image) => { 
      if (fs.existsSync(image.path) && image.path) fs.unlinkSync(image.path)
    })

    fs.unlinkSync(content.mockup.path)
    fs.unlinkSync(filePath)
  }
}


module.exports = {
  renderPNG,
  saveMockup,
  cleanTempFiles,
  copyMockupFile,
  deleteTempJson
}
