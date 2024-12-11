// app.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// add data to req.body (for POST requests)
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

// import  and use express-session module
const session = require('express-session');
app.use(session({
	secret: 'login', //used to sign the session ID cookie
	name: 'login', // (optional) name of the session cookie
	resave: true, // forces the session to be saved back to the session store
	saveUninitialized: true, // forces a session an uninitialized session to be saved to the store	
}));


// serve static files
app.use(express.static('../frontend/public'));

// Middleware pour définir res.locals.logged
app.use((req, res, next) => {
	res.locals.logged = req.session.loggedin || false;
	next();
  });

const login = require('./routers/login');
app.use('/',login);

const recipes = require('./routers/recipes');
app.use('/recipes',recipes);

const submit = require('./routers/submit');
app.use('/submit',submit);

const admin = require('./routers/admin');
app.use('/admin', admin);

const router = require('./routers/router');
app.use('/', router);

// Middleware 404 (après toutes les routes définies)
app.use((req, res) => {
	res.status(404).render('404.ejs'); // Rendu de la page 404
});

// Middleware pour les erreurs internes
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Erreur interne du serveur.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
