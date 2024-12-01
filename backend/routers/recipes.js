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

router.use('/', function (req, res) {

    db.all(" SELECT * FROM RECIPE where status='VALID';", (err, rows) => {
        if(err){
            next(err);
        } else {
            console.log(rows);
            res.render('recipes.ejs', {recipes: rows, logged: req.session.loggedin});
        }
    });

});


module.exports = router;