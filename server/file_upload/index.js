const FileUpload = require("./base");
const GDriveFileUpload = require("./drive");

const InitFileUpload = () => {
  return new GDriveFileUpload();
};

module.exports = {
  FileUpload,
  InitFileUpload,
};
