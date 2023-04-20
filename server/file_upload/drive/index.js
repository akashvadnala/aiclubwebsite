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

  async uploadFile({ name, file, mimeType, folder_id }) {
    const media = {
      mimeType,
      body:  fs.createReadStream(file),
    };

    const resource = {
      name,
      'parents': [folder_id],
    };

    try {
      const res = await this.drive.files.create({
        resource,
        media,
        field: "id",
      });
      return res.data.id;
    } catch (err) {
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
