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




router.get('/search', (req, res) => {
  const query = req.query.query || ''; // Préfixe saisi par l'utilisateur
  const searchQuery = `
    SELECT DISTINCT r.*
    FROM RECIPE r
    LEFT JOIN RECIPE_INGREDIENT ri ON r.recipeId = ri.recipeId
    WHERE (r.name LIKE ? OR ri.ingredient LIKE ?)
    AND r.status = 'VALID'
  `;

  db.all(searchQuery, [`%${query}%`, `%${query}%`], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la recherche des recettes.");
    }

    // Rendre les résultats partiels avec un template EJS
    res.render('partials/search-results.ejs', { recipes: rows });
  });
});

router.get("/all", (req, res) => {
  const query = "SELECT * FROM RECIPE WHERE status='VALID';"; // Requête pour récupérer toutes les recettes
  db.all(query, [], (err, rows) => {
      if (err) {
          return res.status(500).send("Erreur lors de la récupération des recettes.");
      }
      res.render("partials/search-results.ejs", { recipes: rows });
  });
});



router.get('/', function (req, res, next) {

  if (req.query['recipe']){
    
    let recipeId = req.query['recipe'];
    //console.log(recipeId);

    db.get(" SELECT * FROM RECIPE where recipeId=" +recipeId+ ";", (err, row) => {
      if(err){
          next(err);
      } else {

        db.all(" SELECT * FROM RECIPE_INGREDIENT where recipeId=" +recipeId+ ";", (err, rows) => {
            if(err){
                next(err);
            }else{
              //console.log(row);
              //console.log(rows);
              res.render('recipes.ejs', {specificRecipe:true, recipe:row, ingredients:rows, logged: req.session.loggedin});
            }
        });
          
      }
    });
  }else{
    next();
  }
});

router.use('/', function (req, res) {

    db.all(" SELECT * FROM RECIPE where status='VALID';", (err, rows) => {
        if(err){
            next(err);
        } else {
            //console.log(rows);
            res.render('recipes.ejs', {specificRecipe:false, recipes: rows, logged: req.session.loggedin, ingredients:[]});
        }
    });

});


module.exports = router;