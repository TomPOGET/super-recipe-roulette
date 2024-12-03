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


  router.post("/", (req, res) => {
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