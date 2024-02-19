const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const Data = require("../userData/data")
const public_users = express.Router();

const db = 'mongodb+srv://Andrew:Pass123321@cluster0.hgdmsbr.mongodb.net'

const Exist =  (user) => {
    let exist =  Data.findOne({ username: user });
    return exist;
};

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  const data = new Data({ username, password });
  if (username && password) {
      const userExists =  Exist(username);
      if (!userExists) {
        data.save();
        res.send("User " + username + " has been added!");
      } else {
        return res.json({ message: "Username is already taken!" });
      }
  } else {
    return res.send("Error in registration, try again");
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  res.send(await books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let is = req.params.isbn;
  res.send(await books[is]);
});
  
// Get book details based on author
public_users.get('/author/:author',(req, res) => {
  let auth = Object.values(books).filter((book) => 
    book.author == req.params.author
  );
  res.send(auth);
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const tit = Object.values(await books).filter((book) => 
    book.title == req.params.title
  );
 res.send(tit)
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  let isbn = req.params.isbn;
  res.send(await books[isbn].reviews)
});

module.exports.general = public_users;
