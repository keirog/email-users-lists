'use strict';

// External modules
const mongoose = require('mongoose');

// Our modules
const Metadata = mongoose.model('Metadata');

exports.list = (req, res) => {
  Metadata.findOne()
    .exec((err, metadata) => {
      /* istanbul ignore if */
      if (err) {
        return res.status(500).json({
          message: err
        });
      }
      else {
        res.json(metadata || { fields: [] });
      }
    });
};
