const express = require('express');
const router = express.Router();


router.use('/', function (req, res) {

        /*db.all(" SELECT * FROM ..;", (err, rows) => {
            if(err){
                next(err);
            } else {
                res.render('menu.ejs', {menu: rows, logged: req.session.loggedin});
            }
        });*/
        res.render('search.ejs');
});


module.exports = router;