const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

   if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user. Username or password is missing."});
});

// Get all books using async/await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req,res) => {

  const isbn = req.params.isbn;

  try {

    const response = await axios.get("http://localhost:5000/");

    const book = response.data[isbn];

    if(!book){
      return res.status(404).json({message:"Book not found"});
    }

    return res.status(200).json(book);

  } catch(error){
    return res.status(500).json({message:"Error retrieving book"});
  }

});

// Get books by author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    let filteredBooks = Object.values(books).filter(
      (book) => book.author === author
    );
    
    if (filteredBooks.length === 0) {
      return res.status(404).json({message: "No books found for the given author"});
    }

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get books by title
public_users.get('/title/:title', async (req,res) => {

  const title = req.params.title;

  try{

    const response = await axios.get("http://localhost:5000/");

    const books = Object.values(response.data).filter(
      book => book.title === title
    );

    if(books.length === 0){
      return res.status(404).json({message:"Book not found"});
    }

    return res.status(200).json(books);

  }catch(error){
    return res.status(500).json({message:"Error retrieving books"});
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;