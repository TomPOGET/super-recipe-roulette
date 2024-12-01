// routers/admin.js
const express = require('express');
const router = express.Router();

// Middleware pour vérifier si l'utilisateur est connecté
function isAuthenticated(req, res, next) {
  if (req.session && req.session.loggedin) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Appliquer le middleware uniquement à la route /admin
router.get('/admin', isAuthenticated, (req, res) => {
  res.render('admin.ejs'); // Rendre admin.ejs avec le nom d'utilisateur
});

module.exports = router;
