const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        required: false,
    },
    verifyToken:{
        type: String,
        required: false,
        trim: true        
    },
});

UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema );
module.exports = User;