const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const Data = require("../userData/data")


let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser =  (username,password)=>{ 
    let check =  Data.findOne({username: username, password: password})
    return check;  
}

//only registered users can login
regd_users.post("/login",  (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  const Auth = authenticatedUser(username,password);
  if (!username || !password){
    return res.status(404).json({message:"Error in login or password!"})
  } else{
    if (Auth){
      const accessToken = jwt.sign({
        data: password
      }, 'access',{expiresIn: 60*60});

      req.session.authorization = {
        accessToken,username
      }
      return res.status(200).send("User seccessfully logged in!");
    } else{
      return res.status(208).json({message:"Invalid Username or password"})
    }
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  let book = books[isbn];
  let review = req.body.review;
  if (review){
    books[isbn].reviews[user] = review;

  } else{
    res.send("review is empty")
  }
  res.send('Rewiew been updated')
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (!books[isbn]){
    return res.send("Invalid IBSN");
  } else if (!books[isbn].reviews[user]){
    return res.send(`You, ${user}, doesn't have any reviews!`)
  } else {
    delete books[isbn].reviews[user];
    res.send("Review has benn deleted")
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
