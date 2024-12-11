const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Chemin du dossier pour enregistrer les images
    const dir = path.resolve(__dirname, '../../frontend/public/img/recipes');

    // Vérifier si le répertoire existe, sinon le créer
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir); // Stocker l'image dans ce répertoire
  },
  filename: function (req, file, cb) {
    // Utiliser un timestamp pour générer un nom de fichier temporaire
    cb(null, Date.now() + path.extname(file.originalname)); // Le nom temporaire inclut l'extension du fichier d'origine
  }
});

const upload = multer({ storage: storage });

// Connexion à la base de données SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/reciperoulette.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database!');
});

// Route pour gérer la soumission du formulaire
router.post('/', upload.single('recipeImage'), function (req, res) {
  console.log(req.body);

  const { name, instructions, category, ingredients } = req.body;

  if (name && name.trim() && instructions && instructions.trim() && category && ingredients) {
    db.serialize(() => {
      // Insérer la recette dans la base de données
      const insertRecipeQuery = `
        INSERT INTO RECIPE (name, instructions, category, status)
        VALUES (?, ?, ?, 'INVALID')
      `;

      db.run(insertRecipeQuery, [name, instructions, category], function (err) {
        if (err) {
          console.error("Erreur lors de l'insertion de la recette : ", err.message);
          return res.status(500).send("Erreur lors de l'insertion de la recette.");
        }

        const recipeId = this.lastID; // ID de la recette insérée

        // Renommer l'image avec l'ID de la recette
        if (req.file) {
          const extname = path.extname(req.file.originalname); // Extension de l'image
          const newImagePath = path.resolve(__dirname, `../../frontend/public/img/recipes/${recipeId}.png`);

          // Renommer le fichier image
          fs.rename(req.file.path, newImagePath, (err) => {
            if (err) {
              console.error("Erreur lors du renommage de l'image :", err);
              return res.status(500).send("Erreur lors du renommage de l'image.");
            }

            console.log("Image renommée avec succès !");
          });
        }

        // Insérer les ingrédients dans la base de données
        const insertIngredientQuery = `
          INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
          VALUES (?, ?, ?, ?)
        `;

        ingredients.forEach(ingredient => {
          const { name, quantity, unit } = ingredient;
          if (name.trim() && quantity && !isNaN(quantity) && Number(quantity) >= 0 && unit.trim()) {
            db.run(insertIngredientQuery, [recipeId, name, quantity, unit], (err) => {
              if (err) {
                console.error("Erreur lors de l'insertion des ingrédients : ", err.message);
                return res.status(500).send("Erreur lors de l'insertion des ingrédients.");
              }
            });
          }
        });

        
        res.status(200).redirect('/');
      });
    });
  } else {
    res.status(400).send("Formulaire incomplet.");
  }
});

router.use('/', function (req, res) {
	res.render('submit.ejs', {logged: req.session.loggedin});
});

module.exports = router;
