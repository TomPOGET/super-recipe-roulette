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


router.post("/approve", (req, res) => {
  const recipeId = req.body.approve;

  if (!recipeId) {
      return res.status(400).send("ID de la recette non fourni.");
  }

  const query = `UPDATE RECIPE SET status = 'VALID' WHERE recipeId = ?`;

  db.run(query, [recipeId], function (err) {
      if (err) {
          console.error("Erreur lors de la mise à jour de la recette :", err);
          return res.status(500).send("Erreur interne du serveur.");
      }

      if (this.changes === 0) {
          return res.status(404).send("Recette non trouvée.");
      }

      res.status(200).send("Recette approuvée avec succès !");
  });
});


router.post('/reject', (req, res) => {
const recipeId = req.body.id;

const deleteQuery = `DELETE FROM RECIPE WHERE recipeId = ?`;

db.run(deleteQuery, [recipeId], function (err) {
    if (err) {
        return res.status(500).send("Erreur lors du rejet de la recette.");
    }

    res.status(200).send("Recette rejetée avec succès !");
});
});



router.post('/delete', (req, res) => {
const recipeId = req.body.id;

const deleteQuery = `DELETE FROM RECIPE WHERE recipeId = ?`;

db.run(deleteQuery, [recipeId], function (err) {
    if (err) {
        return res.status(500).send("Erreur lors de la suppression de la recette.");
    }

    res.status(200).send("Recette supprimée avec succès !");
});
});



router.get('/edit/:id', (req, res) => {
const recipeId = req.params.id;

// Récupérer les données de la recette depuis la base de données
const getRecipeQuery = `
    SELECT * FROM RECIPE WHERE recipeId = ?
`;

const getIngredientsQuery = `
    SELECT * FROM RECIPE_INGREDIENT WHERE recipeId = ?
`;

db.serialize(() => {
    db.get(getRecipeQuery, [recipeId], (err, recipe) => {
        if (err) {
            console.error("Erreur lors de la récupération de la recette :", err.message);
            return res.status(500).send("Erreur interne.");
        }

        if (!recipe) {
            return res.status(404).send("Recette introuvable.");
        }

        db.all(getIngredientsQuery, [recipeId], (err, ingredients) => {
            if (err) {
                console.error("Erreur lors de la récupération des ingrédients :", err.message);
                return res.status(500).send("Erreur interne.");
            }

            // Rendre la vue avec les données de la recette et des ingrédients
            res.render('edit', { recipe, ingredients });
        });
    });
});
});



router.post('/edit/:id', (req, res) => {
const recipeId = req.params.id;
const { name, instructions, category, ingredients } = req.body;

const updateRecipeQuery = `
    UPDATE RECIPE
    SET name = ?, instructions = ?, category = ?
    WHERE recipeId = ?
`;

const deleteIngredientsQuery = `
    DELETE FROM RECIPE_INGREDIENT WHERE recipeId = ?
`;

const insertIngredientQuery = `
    INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
    VALUES (?, ?, ?, ?)
`;

db.serialize(() => {
    // Mettre à jour la recette
    db.run(updateRecipeQuery, [name, instructions, category, recipeId], (err) => {
        if (err) {
            console.error("Erreur lors de la mise à jour de la recette :", err.message);
            return res.status(500).send("Erreur interne.");
        }

        // Supprimer les ingrédients actuels
        db.run(deleteIngredientsQuery, [recipeId], (err) => {
            if (err) {
                console.error("Erreur lors de la suppression des ingrédients :", err.message);
                return res.status(500).send("Erreur interne.");
            }

            // Réinsérer les nouveaux ingrédients
            ingredients.forEach(ingredient => {
                const { name, quantity, unit } = ingredient;
                db.run(insertIngredientQuery, [recipeId, name, quantity, unit], (err) => {
                    if (err) {
                        console.error("Erreur lors de l'ajout des ingrédients :", err.message);
                    }
                });
            });

            res.redirect('/'); // Rediriger vers la page principale après modification
        });
    });
});
});


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
