const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
    if (book) {
        res.json(JSON.stringify(book));
    } else {
        res.status(404).send('Book not found');
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const results = [];

  Object.keys(books).forEach(key => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
          results.push(books[key]);
      }
  });

  if (results.length > 0) {
      res.json(JSON.stringify(results));
  } else {
      res.status(404).send('No books found for the given author');
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const results = [];
  
    Object.keys(books).forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            results.push(books[key]);
        }
    });
  
    if (results.length > 0) {
        res.json(JSON.stringify(results));
    } else {
        res.status(404).send('No books found for the given title');
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
      if (book) {
          res.json(JSON.stringify(book['reviews']));
      } else {
          res.status(404).send('Book not found');
      }
  
});

async function getBooks() {
    try {
        const response = await axios.get('https://arjanituka-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        return response.data;
    } catch (error) {
        throw error;
    }
}
async function getBookDetailsByISBN(isbn) {
    try {
        const response = await axios.get(`https://arjanituka-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
async function getBookDetailsByAuthor(author) {
    try {
        const response = await axios.get(`https://arjanituka-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getBookDetailsTitleBased(title) {
    try {
        const response = await axios.get(`https://arjanituka-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


module.exports.general = public_users;
