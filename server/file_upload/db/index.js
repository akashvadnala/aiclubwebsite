const FileUpload = require('../base');
const mongoose = require('mongoose');
const fs = require('fs');
const Config = require('../../Config');

class DBFileUpload extends FileUpload {
  constructor() {
    super();
    this.bucket = null; // lazy init when mongoose connection is ready
  }

  _initBucket() {
    if (!this.bucket) {
      if (!mongoose.connection || !mongoose.connection.db) {
        throw new Error('MongoDB connection not ready');
      }
      this.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    }
  }

  async uploadFile({ name, file, mimeType }) {
    this._initBucket();
    return new Promise((resolve, reject) => {
  // store content type under metadata so it can be read back reliably
  const uploadStream = this.bucket.openUploadStream(name, { metadata: { contentType: mimeType } });
      const readStream = fs.createReadStream(file);

      readStream.pipe(uploadStream)
        .on('error', (err) => {
          reject(new Error(`error uploading file to db: ${err}`));
        })
        .on('finish', () => {
          // return the object id as key
          resolve(uploadStream.id.toString());
        });
    });
  }

  async deleteFile(key) {
    try {
      this._initBucket();
      const id = new mongoose.Types.ObjectId(key);
      await this.bucket.delete(id);
      return true;
    } catch (err) {
      throw new Error(`error deleting file from db: ${err}`);
    }
  }

  getUrl(key) {
  // return absolute URL so browser requests go to the server (not the client origin)
  const base = (Config && Config.SERVER_URL) ? Config.SERVER_URL.replace(/\/$/, '') : '';
  return `${base}/file/${key}`;
  }
}

module.exports = DBFileUpload;
