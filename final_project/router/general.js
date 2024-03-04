const express = require('express');
const axios = require('axios')
// let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const Data = require("../userData/data")
const Book = require("../userData/book")

const public_users = express.Router();

const db = 'mongodb+srv://Andrew:123321@cluster0.hgdmsbr.mongodb.net/userData'

const Exist = async (user) => {
    let exist = await Data.findOne({username: user });
    try{
    return exist;
    } catch(err){
      console.log(err);
      return false;
    }
};

public_users.get("/allusers",async (req,res)=>{
  let users = await Data.find();
  res.send(users)
})

public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const root = "User";
  const data = new Data({ username, password,root });
  if (username && password) {
      const userExists = await Exist(username);
      if (!userExists) {
       data.save()
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
  res.send(await Book.find({},{_id:0,__v:0}))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let is = req.params.isbn;
  res.send(await Book.find({ibsn:is},{_id:0,__v:0}))
});
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  res.send(await Book.find({author:author},{_id:0,__v:0}))

});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title
  res.send(await Book.find({title:title},{_id:0,__v:0}))
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  let isbn = req.params.isbn;
  const book = await Book.findOne({ibsn:isbn},{reviews:1,_id:0,__v:0})
  res.send(book.reviews)
});

module.exports.general = public_users;
