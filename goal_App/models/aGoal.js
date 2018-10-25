var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GoalSchema = new Schema(
    {
        goal: {type: String, required: true, max: 100},
        owner: {type: Schema.Types.ObjectId, ref: 'orgChart'},
        initScore: {type: Number},
        targScore: {type: Number},
        childTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
        parentTo: [{type: Schema.Types.ObjectId, ref: 'goalList'}],
        statusOwner: {type: String, enum: ['Approved', 'Pending', 'Rejected']},
        statusApprover: {type: String, enum: ['Approved', 'Pending', 'Rejected']},
        history: {type: Schema.Types.ObjectId, ref: 'hData'},
        created: {type: Date},
        updated: {type: Date},
        comments: {type: String},
        offer: {type: Schema.Types.ObjectId, ref: 'goalList'},
        weight: {type: Number, default: 1}
    }
);

GoalSchema.virtual('url').get(function() {
    return '/catalog/goalList/' + this._id;
});

GoalSchema.virtual('status').get(function() {
    if (this.statusOwner == 'Approved' && this.statusApprover == 'Approved') {
        return 'Approved';
    } else if (this.statusOwner == 'Rejected' || this.statusApprover == 'Rejected') {
        return 'Rejected';
    } else {
        return 'Pending';
    }
});

module.exports = mongoose.model('goalList', GoalSchema);