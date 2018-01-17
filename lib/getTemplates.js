const path = require("path");
const fs = require("fs");
const electron = require("electron");
const decache = require("decache");

const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const thumbsPath = `${userDataPath}/templates/thumbs`;
const mockupsPath = `${userDataPath}/templates/mockups`;

if (!fs.existsSync(`${userDataPath}`)) fs.mkdir(`${userDataPath}`);
if (!fs.existsSync(`${userDataPath}/templates`))
  fs.mkdir(`${userDataPath}/templates`);
if (!fs.existsSync(`${mockupsPath}`)) fs.mkdir(mockupsPath);
if (!fs.existsSync(`${thumbsPath}`)) fs.mkdir(thumbsPath);

function getAllTemplatesFiles() {
  return fs
    .readdirSync(`${userDataPath}/templates`)
    .filter(fileName => /\.(json)/.test(fileName));
}

function createTemplateDirectory() {
  fs.mkdirSync(`${userDataPath}/templates`);
  fs.mkdirSync(thumbsPath);
  fs.mkdirSync(mockupsPath);
}

function getLoadTemplateObj() {
  return new Promise((resolve, reject) => {
    const templates = getAllTemplatesFiles();
    const obj = templates.map(filePath => {
      decache(`${userDataPath}/templates/${filePath}`);
      let content = require(`${userDataPath}/templates/${filePath}`);
      content.fileName = filePath;
      if (!path.isAbsolute(content.mockup.path)) {
        content.mockup.path = path.join(
          `${userDataPath}/templates/`,
          content.mockup.path
        );
      }
      return content;
    });

    resolve({ yourMockups: obj });
  });
}

module.exports = {
  getAllTemplatesFiles,
  userDataPath,
  thumbsPath,
  mockupsPath,
  getLoadTemplateObj
};
