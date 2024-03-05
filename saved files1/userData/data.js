const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userData = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    root:{
        type: String,
        required: true,
    }
},);


const Data = mongoose.model('Data', userData);
module.exports = Data;