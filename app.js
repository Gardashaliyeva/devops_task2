const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple Hello World route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// A new route that echos back what you post to it
app.post('/echo', (req, res) => {
  const { message } = req.body;
  res.json({ echo: message });
});

// Route for adding two numbers
app.get('/add/:num1/:num2', (req, res) => {
  const num1 = parseInt(req.params.num1, 10);
  const num2 = parseInt(req.params.num2, 10);
  
  if (isNaN(num1) || isNaN(num2)) {
    res.status(400).send('Bad request');
  } else {
    const sum = num1 + num2;
    res.json({ sum });
  }
});

module.exports = app;
