const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const Exist = (username)=>{
  let exist = users.filter((name)=>{
    return name.username == username
  });
  if (exist.length > 0){
    return true;
  }else {
    return false;
  }
}
public_users.post("/register", (req,res) => {
  const user = req.body.username;
  const pass = req.body.password;

  if (user && pass){
    if (!Exist(user)){
      users.push({"username":user,"password":pass});
      return res.send("User "+ user+ " has been added!")
    }else{
      return res.status(404).json({message:"Username is already taken!"})
    }
  }{
    return res.send("Error in registration, try again")
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
