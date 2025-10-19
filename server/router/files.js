const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.connection || !mongoose.connection.db) {
      return res.status(500).send('DB not ready');
    }
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const _id = new mongoose.Types.ObjectId(id);
    const filesColl = mongoose.connection.db.collection('uploads.files');
    const fileDoc = await filesColl.findOne({ _id });
    if (!fileDoc) return res.status(404).send('File not found');
  // contentType may be stored under metadata or at top-level depending on upload
  const contentType = (fileDoc.metadata && fileDoc.metadata.contentType) || fileDoc.contentType || 'application/octet-stream';
  res.set('Content-Type', contentType);
    res.set('Content-Disposition', `inline; filename="${fileDoc.filename}"`);
    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.pipe(res).on('error', (err) => {
      res.status(500).send(err.message);
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
