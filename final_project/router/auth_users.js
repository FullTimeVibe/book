const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
const Data = require("../userData/data");
const Book = require("../userData/book");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Books')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+".pdf")
  }
})
const upload = multer({ storage: storage })

const db = 'mongodb+srv://Andrew:@cluster0.hgdmsbr.mongodb.net/userData'


const authenticatedUser = async (user,pass)=>{ 
    let check = await Data.findOne({ username:user, password:pass});
    return check;
}

regd_users.post("/login", async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  auth = await authenticatedUser(username,password);
  if (!username || !password){
    return res.status(404).json({message:"Error in login or password!"})
  } else{
    if (auth){
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

regd_users.delete("/auth/deleteUser", async (req, res) => {
  const user = req.body.username;
  const pass = req.body.password;
  check = await authenticatedUser(user,pass);
  if (check){
  await Data.deleteOne({username:user})
  res.send(`User ${user} has been deleted!`)
} else{
  res.send("Incorrecet username or password!")
}
});

regd_users.post("/auth/addbook", upload.single('File'), (req,res)=>{
  const {ibsn,author,title} = req.body;
  const reviews = {null:null}
  const file = req.file.filename
  const book = new Book({file,ibsn,author,title,reviews});
  book
  .save()
  .then(async ()=>{
  res.send("done")
})
  .catch((err)=>{
  console.log(err);
  res.send("Error. Check data!")
})
})

regd_users.get("/auth/allusers",async (req,res)=>{
  const user = req.session.authorization.username;
  const root = await Data.findOne({username:user},{_id:0, root:1});
  if (root.root == "Admin"){
    let users = await Data.find();
    res.send(users)
  } else {
    res.send("You have no access!")
  }
})

regd_users.post("/auth/allusers",async (req,res)=>{
  const admin = req.session.authorization.username;
  const user = req.body.username;
  const root = await Data.findOne({username:admin},{_id:0, root:1});
  if (root.root == "Admin"){
    await Data.findOneAndUpdate({username:user},{$set: {root:"Admin"}})
    res.send("User root updated")
  } else {
    res.send("You have no access!")
  }
})

regd_users.put("/auth/review/:isbn",async (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
 let book = await Book.findOne({ ibsn: isbn });
  if (!book) {
    return res.send("Book not found");
  }
  let review = req.body.review;
  if (review){
    await Book.findOneAndUpdate(
      { ibsn: isbn },
      { $set: { [`reviews.${user}`]: req.body.review } }
    );
  } else{
    res.send("review is empty")
  }
  res.send('Rewiew been updated')
});

regd_users.delete("/auth/review/:isbn", async(req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (await Book.find({ ibsn: isbn, reviews: [`reviews.${user}`] })){
    return res.send(`You, ${user}, doesn't have any reviews, on this book!`)
  } else {
    await Book.findOneAndUpdate(
      { ibsn: isbn },
      {
        $unset: {
          [`reviews.${user}`]: 1
        }
      }
    );
    res.send("Review has benn deleted")
  }
});

module.exports.authenticated = regd_users;
