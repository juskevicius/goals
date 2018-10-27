var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orgUnit = new Schema(
    {
        name: {type: String, required: true, max: 25},
        owner: {type: String, required: true, max: 30},
        unitType: {type: String, required: true, enum: ['Country', 'Department', 'Group'], max: 30},
        parentTo: [{type: Schema.Types.ObjectId, ref: 'orgChart'}],
        childTo: [{type: Schema.Types.ObjectId, ref: 'orgChart'}],
    }
);

orgUnit.virtual('url').get(function() {
    return '/catalog/orgChart/' + this._id;
});

module.exports = mongoose.model('orgChart', orgUnit, 'orgchart');