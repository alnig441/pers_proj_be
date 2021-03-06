const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const RequestParser = require('../../app_modules/request-parser');
const userSchema = require('../../schemas/userSchema');
const photoSchema = require('../../schemas/photoSchema');

const Photo = mongoose.model('Photo', photoSchema);
const User = mongoose.model('User', userSchema);

const PhotoRequest = new RequestParser(photoSchema, 'Photo');

router.post('/UpdateById/:_id?/Photos',(req, res, next) => {

  let incoming = req.body ? req.body : req.query;

  query = PhotoRequest.parse(incoming);

  Photo.updateOne({ _id: new ObjectId(req.params._id) }, query)
    .then(result => {
      if (!req.accepts().includes("application/json")) {
        res.render('results', { docs: result, endpoint: 'photos' })
      } else {
        res.format({
          json: () => {
            res.send(result);
          }
        })
      }
    })
    .catch(error => {
      res.render('error: ', { message: error })
    })
})

router.post('/Update/Photos?', (req, res, next) => {

  let incoming = req.body ? req.body : req.query;
  let _ids = [];

  incoming['_ids'].forEach((id, index) => {
    _ids.push({_id: new ObjectId(id)});
  })

  let query = PhotoRequest.parse(incoming['form']);

  Photo.updateMany({ $or: _ids }, query)
    .then(result => {
      res.format({
        json: () => {
          res.send(result);
        }
      })
    })
    .catch( error => {
      res.render('error', { message: error });
    })
})


module.exports = router;
