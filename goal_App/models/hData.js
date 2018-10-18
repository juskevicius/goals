var mongoose = require('mongoose');

var Schema = mongoose.schema;

var hData = new Schema(
    {
        data: [{
            date: {type: Date, required: true},
            value: {type: Number, required: true}
        }]  
    }
);

module.exports = mongoose.model('hData', hData);