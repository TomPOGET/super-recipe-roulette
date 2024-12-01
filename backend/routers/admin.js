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

<<<<<<< HEAD
// Appliquer le middleware uniquement à la route /admin
router.get('/admin', isAuthenticated, (req, res) => {
  res.render('admin.ejs'); // Rendre admin.ejs avec le nom d'utilisateur
=======
// Appliquer le middleware d'authentification à toutes les routes de ce routeur
router.use(isAuthenticated);

// Route pour afficher le tableau de bord administrateur
router.get('/', (req, res) => {
  res.render('admin'); // Ceci va rendre le fichier admin.ejs
>>>>>>> 4da9fc661d268392532f4514a75f14da6a4c2a51
});

module.exports = router;
