const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookData = new Schema({
    ibsn:{
     type: Number,
    },
    author:{
     type: String,
    },
    title:{
     type: String,
    },
    reviews:{
     type: Object,
     default:{}
    }
 },);

const Book = mongoose.model('Books', bookData);
module.exports = Book;