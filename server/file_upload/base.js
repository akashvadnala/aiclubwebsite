class FileUpload {
  constructor() {}

  async uploadFile(key, mimeType) {
    throw new Error("not implemented");
  }

  async deleteFile(key) {
    throw new Error("not implemented");
  }

  getUrl(key) {
    throw new Error("not implemented");
  }
}

module.exports = FileUpload;
