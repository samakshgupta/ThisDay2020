const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const userSchema = new Schema({
    email : {
        type: String,
        lowercase: true,
        trim: true,
        unique: true
    },
    city : {
        type : String
    },
    country : {
        type : String,
    },
    age : {
        type: Number,
    },
    gender : {
        type: String,
    },
    token: {
        type: String,
        unique: true
    },
    cron_date: {
        type: Date
    },
    time: {
        type: String
    }
}, {
    collection : 'users',
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

userSchema.plugin(timestamps);


module.exports = mongoose.model('User', userSchema);