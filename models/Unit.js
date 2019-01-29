const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orgUnit = new Schema(
  {
    name: { type: String, required: true, max: 25 },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    unitType: { type: String, required: true, enum: ['Country', 'Department', 'Group', 'Person'], max: 30 },
    childTo: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
    parentTo: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
  },
);

module.exports = mongoose.model('Unit', orgUnit, 'orgchart');
