const express = require('express');
let users = require("./auth_users.js").users;
const Data = require("../userData/data")
const Book = require("../userData/book")
const fs = require("fs")

const public_users = express.Router();

const db = 'mongodb+srv://Andrew:@cluster0.hgdmsbr.mongodb.net/userData'

const Exist = async (user) => {
    let exist = await Data.findOne({username: user });
    try{
    return exist;
    } catch(err){
      console.log(err);
      return false;
    }
};

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

public_users.get('/',async function (req, res) {
  res.send(await Book.find({},{_id:0,__v:0,file:0}))
});

public_users.get('/getbook/:isbn', async function (req, res) {
  let is = req.params.isbn;
  const fileName = await Book.findOne({ibsn:is},{_id:0,__v:0})
  fs.readFile(`./Books/${fileName.file}`, (err,data)=>{
    if (err){
        res.send("Error!");
        console.log(err)
    } else{
        res.end(data)
    }
})
});
  
public_users.get('/isbn/:isbn', async function (req, res) {
  let is = req.params.isbn;
  res.send(await Book.find({ibsn:is},{_id:0,__v:0,file:0}))
});
  
public_users.get('/author/:author',async (req, res) => {
  const author = req.params.author
  res.send(await Book.find({author:author},{_id:0,__v:0,file:0}))
});

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title
  res.send(await Book.find({title:title},{_id:0,__v:0,file:0}))
});

public_users.get('/review/:isbn',async (req, res) => {
  let isbn = req.params.isbn;
  const book = await Book.findOne({ibsn:isbn},{reviews:1,_id:0,__v:0})
  res.send(book.reviews)
});

module.exports.general = public_users;
