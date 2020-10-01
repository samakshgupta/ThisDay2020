const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const questionSchema = new Schema({
    question : {
        type : String,
        unique: true
    },
    day: {
        type: Number,
        unique: true
    }
}, {
    collection : 'questions',
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

questionSchema.plugin(timestamps);


module.exports = mongoose.model('Question', questionSchema);