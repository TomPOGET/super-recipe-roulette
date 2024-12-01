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

// Appliquer le middleware d'authentification à toutes les routes de ce routeur
router.use(isAuthenticated);

// Route pour afficher le tableau de bord administrateur
router.get('/admin', (req, res) => {
  res.render('admin'); // Ceci va rendre le fichier admin.ejs
});

module.exports = router;
