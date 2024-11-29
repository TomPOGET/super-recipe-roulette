const express = require('express');
const router = express.Router();

// add data to req.body (for POST requests)
router.use(express.urlencoded({ extended: true }));

const crypto = require('crypto');


// Exemple d'utilisation :
console.log(stringHashCode("exemple")); 


router.use('/login', function (req, res) {
	res.render('login.ejs', {logged: req.session.loggedin});
});

router.use('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/login');
});


//fonction pour hasher le mdp
function stringHashCode(str) {
    return crypto.createHash('sha256')  // Utiliser SHA-256 ou 'sha1', 'md5', etc.
                 .update(str)
                 .digest('hex');  // retourne le hash en hexadécimal
}

console.log(stringHashCode('admin'));

module.exports = router;