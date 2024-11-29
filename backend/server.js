// app.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// add data to req.body (for POST requests)
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

//session pour tout le monde ou bien juste admin?


// serve static files
app.use(express.static('../frontend/public'));

const search = require('./routers/search');
app.use('/search',search);

const router = require('./routers/router');
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
