const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const answerSchema = new Schema({
    question : {
        type : String,
    },
    answer : {
        type : String,
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },

}, {
    collection : 'answers',
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

answerSchema.plugin(timestamps);


module.exports = mongoose.model('Answer', answerSchema);