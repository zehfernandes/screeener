const path = require('path')
const fs = require('fs')
const electron = require('electron')

const userDataPath = (electron.app || electron.remote.app)
    .getPath('userData')

function getAllTemplatesFiles() {
  if (!fs.existsSync(`${userDataPath}/templates`)) createTemplateDirectory()
  return fs
    .readdirSync(`${userDataPath}/templates`)
    .filter(fileName => /\.(json)/.test(fileName))
}

function createTemplateDirectory() {
  fs.mkdirSync(`${userDataPath}/templates`)
}

function getLoadTemplateObj() {
  const templates = getAllTemplatesFiles()
  console.log(templates)
  const obj = templates.map((filePath) => {
    let content = require(`${userDataPath}/templates/${filePath}`)
    content.mockup.path = `${userDataPath}/templates/${content.mockup.path}`
    return content
  })

  return { 'yourMockups': obj }
}

module.exports = {
  getAllTemplatesFiles,
  userDataPath,
  getLoadTemplateObj,
}
