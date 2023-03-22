const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
}});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const review = req.body.review;
  const isbn = req.params.isbn;
  if (books[isbn]) {
    // Check if the reviewer has already posted a review
    let existingReviewKey = null;
    for (let key in books[isbn].reviews) {
      if (key === username) {
        existingReviewKey = key;
        break;
      }
    }
    // Add or update the review
    if (existingReviewKey) {
      books[isbn].reviews[existingReviewKey] = review;
      res.status(200).send("Review updated");
    } 
    else {
      books[isbn].reviews[username] = review;
      res.status(200).send("Review added");
    }
  }
  else{
      res.send("Please Provide a valid ID");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    if (books[isbn]){
        for (let key in books[isbn].reviews) {
          if (key === username) {
              delete books[isbn].reviews[key];
              res.status(200).send("Review removed");
              break;
          }
        }
      }
      else{
          res.send("Please Provide a valid ID");
      }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
