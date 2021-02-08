const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ZooSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    director: {
        type: String,
        required: true,
        trim: true
    },
    employers: {
        type: Array,
        required: true
    },
    animals: {
        type: Array,
        required: true
    },
});

ZooSchema.plugin(timestamp);

const Zoo = mongoose.model('Zoo', ZooSchema );
module.exports = Zoo;