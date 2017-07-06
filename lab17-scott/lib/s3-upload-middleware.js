'use strict';

//use path to get the extension on a file name for the upload constructor
const path = require('path');
//use fsextra to read the file contents an put on the body key
const fs = require('fs-extra');
//use awssdk to construct the file and upload it to the bucket
const {S3} = require('aws-sdk');
//use s3 to call the object constructor
const s3 = new S3();
//use multer to add body and file objects to the request body
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp-assets`});

//multer returns a callback with fieldnames which returns another function
module.exports = (fieldName) => (req, res, next) => {
  //use .single method from multer to add the body/file objects
  upload.single(fieldName)(req, res, (err => {
    if (err) return next(err);
    //if a file wasn't loaded there wouldn't be a file object. throw error
    if (!req.file) return next(new Error('validation failed, no file uploaded'));
    //if file object was added to the req object, use the upload method on s3
    s3.upload({
      //access control lists. the value is was restricts peoples access.
      ACL: 'public-read',
      //the name of the bucket you want it to upload to. hidden in our env file
      Bucket: process.env.AWS_BUCKET,
      //pull the file name from the file object on the req. Concat with the extension using path
      Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
      //use fs to load any body contents
      Body: fs.createReadStream(req.file.path),
    })
    .promise()
    .then(s3Data => {
      console.log('s3Data: ', s3Data);
      //save the data returned to the req object
      req.s3Data = s3Data;
      //use fs to remove the file from our temp assets
      return fs.remove(req.file.path);
    })
    .then(() => next())
    .catch(next);
  }));
};
