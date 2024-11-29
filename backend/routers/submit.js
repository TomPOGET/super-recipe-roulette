const express = require('express');
const router = express.Router();

// add data to req.body (for POST requests)
router.use(express.urlencoded({ extended: true }));

router.use('/', function (req, res) {
	res.render('submit.ejs', {logged: req.session.loggedin});
});

module.exports = router;