const FileUpload = require("./base");
// prefer DB-backed uploader
const DBFileUpload = require("./db");

const InitFileUpload = () => {
  return new DBFileUpload();
};

module.exports = {
  FileUpload,
  InitFileUpload,
};
