const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hData = new Schema(
  {
    data: [{
      date: { type: Date, required: true },
      value: { type: Number, required: true },
    },
    ],
  },
);

module.exports = mongoose.model('hData', hData);
