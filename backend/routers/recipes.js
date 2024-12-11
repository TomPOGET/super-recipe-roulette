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
    SELECT * 
    FROM RECIPE 
    WHERE name LIKE ?
    AND status = 'VALID'
  `;

  db.all(searchQuery, [`%${query}%`], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la recherche des recettes.");
    }

    // Rendre les résultats partiels avec un template EJS
    res.render('partials/search-results.ejs', { recipes: rows });
  });
});

router.get("/search/ingredient", (req, res) => {
	let ingredient = req.query['ingredient']+'%';
  const statement = db.prepare("SELECT * FROM RECIPE_INGREDIENT WHERE ingredient LIKE ?;");
	statement.all([ingredient], (err, response) => {
		if(err){
			console.log(err);
			next(err);
		} else {
			if(response) {
				res.send(response);
			} else {
				console.log("No result");
			}
		}
		statement.finalize();
		});
});

router.get("/search/get-valid-recipes", (req, res, next) => {
	console.log(req.query['indispensables']);
	var request = `SELECT DISTINCT r1.name, r1.recipeId FROM RECIPE r1, (SELECT recipeId FROM RECIPE_INGREDIENT `;
	if (req.query['indispensables'] && req.query['indispensables'].length > 1) {
		for (let i = 0; i < req.query['indispensables'].length; i++) {
			request += `INTERSECT SELECT recipeId FROM RECIPE_INGREDIENT WHERE ingredient="`
			request += req.query['indispensables'][i]+ '" ';
		};
	}
	else {
		if (req.query['indispensables']) {
			request += `INTERSECT SELECT recipeId FROM RECIPE_INGREDIENT WHERE ingredient="`
			request += req.query['indispensables']+ '" ';
			if (req.query['facultatifs'] && req.query['facultatifs'].length >= 0) {
				request += ` `
			}
		}
	};
	if (req.query['facultatifs'] && req.query['facultatifs'].length > 1) {
		for (let i = 0; i < req.query['facultatifs'].length; i++) {
			request += `INTERSECT SELECT recipeId FROM RECIPE_INGREDIENT WHERE ingredient="`
			request += req.query['facultatifs'][i]+ '" ';
		};
	}
	else {
		if (req.query['facultatifs']) {
			request += `INTERSECT SELECT recipeId FROM RECIPE_INGREDIENT WHERE ingredient="`
			request += req.query['facultatifs']+ '" ';
		}
	};
	request += `) r2 WHERE r1.recipeId = r2.recipeId;`;

	console.log(request);

  const statement = db.prepare(request);
	statement.all([], (err, response) => {
		if(err) {
			console.log(err);
			next(err);
		} else {
			if (response && response.length > 0) {
				var reply = '';
				for (let i = 0; i < response.length; i++) {
					reply += response[i].name + '£' + response[i].recipeId;
					if (i < response.length -1) reply += '$';
				};
				console.log(reply);
				res.send(reply);
			} else {
				var request = `SELECT r1.name, r1.recipeId FROM RECIPE r1, (SELECT recipeId FROM RECIPE_INGREDIENT `;
				if (req.query['indispensables'] && req.query['indispensables'].length > 1) {
					for (let i = 0; i < req.query['indispensables'].length; i++) {
						request += ` INTERSECT SELECT recipeId FROM RECIPE_INGREDIENT WHERE ingredient="`
						request += req.query['indispensables'][i]+ '" ';
					};
				}
				else {
					if (req.query['indispensables']) {
						request += `INTERSECT SELECT recipeId FROM RECIPE_INGREDIENT WHERE ingredient="`
						request += req.query['indispensables']+ '" ';
					}
				};
				request += `) r2 WHERE r1.recipeId = r2.recipeId;`;

				const statement2 = db.prepare(request);
				statement2.all([], (err, response) => {
					if(err){
						console.log(err);
						next(err);
					} else {
						if(response) {
							var reply = '';
							for (let i = 0; i < response.length; i++) {
								reply += response[i].name + '£' + response[i].recipeId;
								if (i < response.length -1) reply += '$';
							};
							console.log(reply);
							res.send(reply);
						} else {
							console.log("No result");
						};
					}
					statement2.finalize();
				});
			};
		}
		statement.finalize();
	});
});

router.get("/all", (req, res) => {
  const query = "SELECT * FROM RECIPE"; // Requête pour récupérer toutes les recettes
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