const fs = require('fs');
const util = require('util');
const append = util.promisify(fs.appendFile);
const exif = require('simple-exiftool');
const mongoose = require('mongoose');
const photoSchema = require('../schemas/photoSchema');
const videoSchema = require('../schemas/videoSchema');

const Photo = mongoose.model('Photo', photoSchema);
const Video = mongoose.model('Video', videoSchema);

const baseUrl = `${process.env.MEDIA_MOUNT_POINT}/${process.env.APP_TMP_FOLDER}/`;

const exifJobs = {

    default: function ( file, cbToJobHandler ){

      exif(baseUrl + file, (error, meta) => {
        if (meta) {
          cbToJobHandler(null, buildDocument(meta));
        } else {
          writeToLog(`\nINFO:\tNo exif data for ${file}`);
          cbToJobHandler( null, {document: file, gps: {}} );
        }

      })

    }

}

function buildDocument(meta) {
  let doRename = meta.FileName.match(/_[0-9]{4}\./);
  let ext = meta.FileName.split('.')[meta.FileName.split('.').length -1];
  let docType = meta.MIMEType.split('/')[0];
  let date = setDate(meta.DateTimeOriginal || meta.CreateDate);
  let fileNamePath = docType + '.fileName';
  let result = {};

  let fileName = doRename ?
    convertTimestamp2FileName(date) + ext:
    meta.FileName;

  let document = docType == 'video' ?
    new Video():
    new Photo();

  document.set({ created: date , [fileNamePath] : fileName } );

  result.document = document;
  result.originalNameAlternateName = { [meta.FileName] : fileName };

  result.gps = meta.GPSPosition && meta.GPSPosition != '0 0' ?
    { latitude  : meta.GPSPosition.split(' ')[0], longitude : meta.GPSPosition.split(' ')[1] }:
    {};

  return result;
}

function setDate( dateString ) {
  let array = dateString.split(' ');
  let date = `${array[0].replace(/:/g, '-')} ${array[1]}`
  return new Date(date);
}

function convertTimestamp2FileName ( timestamp ) {
  timestamp = timestamp.toISOString();
  let newFileName = timestamp.split('.')[0].replace(/t/i, ' ').replace(/:/g, '.') + '.';
  return newFileName;
}

function writeToLog ( message ) {

    append( `.schedule-log-${process.env.NODE_ENV}`, message )
        .then(() => {
            return null;
        })
}

module.exports = exifJobs.default;
