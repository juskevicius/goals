const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orgUnit = new Schema(
    {
        name: {type: String, required: true, max: 25},
        owner: {type: Schema.Types.ObjectId, ref: 'Users'},
        unitType: {type: String, required: true, enum: ['Country', 'Department', 'Group', 'Person'], max: 30},
        parentTo: [{type: Schema.Types.ObjectId, ref: 'orgChart'}],
        childTo: [{type: Schema.Types.ObjectId, ref: 'orgChart'}],
    }
);

orgUnit.virtual('url').get(function() {
    return '/catalog/orgChart/' + this._id;
});

module.exports = mongoose.model('orgChart', orgUnit, 'orgchart');