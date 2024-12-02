const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();

// connecting an existing database (handling errors)
const db  = new sqlite3.Database('./db/reciperoulette.sqlite', (err) => {
	if (err) {
	  console.error(err.message);
	}
	console.log('Connected to the database!');
  });

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

router.get('/', (req, res, next) => {
  // Requêtes pour récupérer les recettes valides et invalides
  const validRecipesQuery = "SELECT * FROM RECIPE WHERE status='VALID'";
  const invalidRecipesQuery = "SELECT * FROM RECIPE WHERE status='INVALID'";

  // Utiliser db.serialize pour garantir l'ordre d'exécution
  db.serialize(() => {
    const results = {};

    // Récupérer les recettes valides
    db.all(validRecipesQuery, (err, validRecipes) => {
      if (err) {
        return next(err); // Passer l'erreur au middleware suivant
      }
      results.validRecipes = validRecipes;

      // Récupérer les recettes invalides
      db.all(invalidRecipesQuery, (err, invalidRecipes) => {
        if (err) {
          return next(err); // Passer l'erreur au middleware suivant
        }
        results.invalidRecipes = invalidRecipes;

        // Rendu de la page avec les deux listes
        res.render('admin', {
          validRecipes: results.validRecipes,
          invalidRecipes: results.invalidRecipes,
        });
      });
    });
  });
});

  


module.exports = router;
