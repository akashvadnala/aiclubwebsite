const { google } = require("googleapis");
const FileUpload = require("../base");
const fs = require('fs');

const GOOGLE_DRIVE_BASE_URL = "https://drive.google.com/uc?expert=view&id=";

class GDriveFileUpload extends FileUpload {
  constructor() {
    super();
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_KEY),
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    this.drive = google.drive({ version: "v3", auth });
  }

  async uploadFile({ name, file, mimeType }) {
    const media = {
      mimeType,
      body:  fs.createReadStream(file),
    };

    const resource = {
      name,
      'parents': ["1ts7i4H312mc57Z-zwdfbDaAcv_8mb8Le"],
    };

    try {
      const res = await this.drive.files.create({
        resource,
        media,
        field: "id",
      });
      // console.log('dataid',res.data);
      return res.data.id;
    } catch (err) {
      console.log('Slow Internet');
      throw new Error(`error uploading file to drive: ${err}`);
    }
  }

  async deleteFile(key) {
    try {
      const _res = await this.drive.files.delete({
        fileId: key,
      });
      return true;
    } catch (err) {
      throw new Error(`error deleting file from drive: ${err}`);
    }
  }

  getUrl(key) {
    return GOOGLE_DRIVE_BASE_URL + key;
  }
}

module.exports = GDriveFileUpload;
