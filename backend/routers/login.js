const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
// add data to req.body (for POST requests)
router.use(express.urlencoded({ extended: true }));

// connecting an existing database (handling errors)
const db  = new sqlite3.Database('./db/reciperoulette.sqlite', (err) => {
	if (err) {
	  console.error(err.message);
	}
	console.log('Connected to the database!');
});

router.post('/login', function (req, res, next) {
	let data = req.body;
    console.log('Tentative de connexion reçue');
	if(data['username']!=null && data['username']!="" && data['password']!=null && data['password']!=""){
		console.log('Champs username et password remplis');
		db.serialize(() => {
            const hashedPassword = stringHashCode(data['password']);
            console.log(`Mot de passe haché: ${hashedPassword}`);
			const statement = db.prepare("SELECT * FROM ADMIN WHERE username = ? AND password = ?;");
			statement.get([data['username'],hashedPassword], (err, result) => {
				if(err){
					next(err);
				} else {
					if(result){
						req.session.loggedin=true;
                        req.session.username = result.username;
                        req.session.email = result.email;
                        console.log(`Utilisateur connecté: ${result.username}`);
						next();
					} else {
						res.render('login.ejs', {logged: false, error: true});
					}
				}
			});
			statement.finalize();
		});
	} else {
		res.render('login.ejs', {logged: false, error: true});
	}
});


router.use('/login', function (req, res) {
	if (req.session.loggedin) {
        // Si l'utilisateur est déjà connecté, le rediriger vers la page d'accueil
        res.redirect('/');
    } else {
        // Afficher la page de connexion avec aucun message d'erreur
        res.render('login.ejs', { logged: req.session.loggedin, error: null });
    }
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

module.exports = router;