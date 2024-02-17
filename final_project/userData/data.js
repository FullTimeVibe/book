const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
},);

const Data = mongoose.model('Data', postSchema);
module.exports = Data;
