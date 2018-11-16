const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GoalSchema = new Schema(
    {
        goal: {type: String, required: true, max: 100},
        owner: {type: Schema.Types.ObjectId, ref: 'Unit'},
        initScore: {type: Number},
        targScore: {type: Number},
        childTo: [{type: Schema.Types.ObjectId, ref: 'Goal'}],
        parentTo: [{type: Schema.Types.ObjectId, ref: 'Goal'}],
        statusOwner: {type: String, enum: ['Approved', 'Pending', 'Rejected']},
        statusApprover: {type: String, enum: ['Approved', 'Pending', 'Rejected']},
        history: {type: Schema.Types.ObjectId, ref: 'hData'},
        created: {type: Date},
        updated: {type: Date},
        comments: {type: String},
        offer: {type: Schema.Types.ObjectId, ref: 'Goal'},
        weight: {type: Number, default: 1}
    }
);

GoalSchema.virtual('status').get(function() {
    if (this.statusOwner == 'Approved' && this.statusApprover == 'Approved') {
        return 'Approved';
    } else if (this.statusOwner == 'Rejected' || this.statusApprover == 'Rejected') {
        return 'Rejected';
    } else {
        return 'Pending';
    }
});

module.exports = mongoose.model('Goal', GoalSchema);