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