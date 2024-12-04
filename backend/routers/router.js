const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données
const db = new sqlite3.Database('./db/reciperoulette.sqlite', (err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err.message);
  } else {
    console.log('Connexion à la base de données réussie');
  }
});

// Route pour la page d'accueil
router.use('/home', function (req, res) {
  res.redirect('/');
});

router.use('/index.html', function (req, res) {
  res.redirect('/');
});



// Route pour la page d'accueil avec une recette du jour aléatoire
router.get('/', function (req, res) {
  const query = `
    SELECT r.recipeId, r.name, r.instructions, r.category, 
           GROUP_CONCAT(i.ingredient || ' (' || i.quantity || ' ' || i.unit || ')') AS ingredients
    FROM RECIPE r
    LEFT JOIN RECIPE_INGREDIENT i ON r.recipeId = i.recipeId
    GROUP BY r.recipeId
    ORDER BY RANDOM()
    LIMIT 1;
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      console.error("Erreur lors de la récupération de la recette :", err);
      return res.status(500).send("Erreur serveur.");
    }

    console.log("Recette récupérée :", row);

    if (row) {
      // Si une recette est trouvée, l'afficher
      res.render('index.ejs', {
        logged: req.session.loggedin,
        recipe: row
      });
    } else {
      // Si aucune recette n'est trouvée, afficher la page sans recette
      res.render('index.ejs', { logged: req.session.loggedin });
    }
  });
});

// Route 404
router.use('*', function(req, res){
  res.status(404);
  res.render('404.ejs', { logged: req.session.loggedin });
});

module.exports = router;
