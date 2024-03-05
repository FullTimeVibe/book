const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookData = new Schema({
    file:{
    type: String,
    required: true
    },
    ibsn:{
     type: Number,
     required: true
    },
    author:{
     type: String,
     required: true
    },
    title:{
     type: String,
     required: true
    },
    reviews:{
     type: Object,
     default:{},
     required: true
    }
 },);

const Book = mongoose.model('Books', bookData);
module.exports = Book;