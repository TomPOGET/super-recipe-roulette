const express = require('express');
const router = express.Router();

// add data to req.body (for POST requests)
router.use(express.urlencoded({ extended: true }));


router.use('/login', function (req, res) {
	res.render('login.ejs', {logged: req.session.loggedin});
});

router.use('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/login');
});

module.exports = router;