const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

let getBooks = new Promise((resolve, reject) => {
    resolve("Resolved");
    return JSON.stringify(books);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const promise = new Promise((resolve, reject) => {
        const data = JSON.stringify(books);
        resolve(data);
    });
    promise.then(data => {
        res.json(data);
    })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const promise = new Promise((resolve, reject) => {
        const data = books[isbn];
        resolve(data);
    });
    promise.then(data => {
        res.json(data);
    })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    let response = [];
    const promise = new Promise((resolve, reject) => {
        for (let key in keys) {
            if (books[key]) {
                if (books[key].author === author) {
                    response.push(books[key]);
                }
            }
        }
        const data = response;
        resolve(data);
    });
    promise.then(data => {
        res.json(data);
    })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    let response = [];
    const promise = new Promise((resolve, reject) => {
        for (let key in keys) {
            if (books[key]) {
                if (books[key].title === title) {
                    response.push(books[key]);
                }
            }
        }
        const data = response;
        resolve(data);
    });
    promise.then(data => {
        res.json(data);
    })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
