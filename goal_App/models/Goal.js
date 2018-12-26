const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const GoalSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
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
        comment: {type: String},
        task: [{description: {type: String}, weight: {type: Number}, implemented: {type: Number}}],
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

GoalSchema.virtual('created_formatted').get(function() {
    return moment(this.created).format('YYYY-MM-DD HH:mm');
});

GoalSchema.virtual('updated_formatted').get(function() {
    if (this.updated) {
        return moment(this.updated).format('YYYY-MM-DD HH:mm');
    } else {
        return '';
    }
    
});

GoalSchema.set('toObject', { getters: true });
GoalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Goal', GoalSchema);