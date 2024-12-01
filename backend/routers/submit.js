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


//Il manque la photo (après)
router.post('/', function(req, res) {
    console.log(req.body);

    // Extraction des données du body
    const { name, instructions, category, ingredients } = req.body;

    // Utilisation de db.serialize pour exécuter les requêtes de manière séquentielle
    db.serialize(() => {
        // 1. Insérer la recette dans la table `RECIPE`
        const insertRecipeQuery = `
            INSERT INTO RECIPE (name, instructions, category, status)
            VALUES (?, ?, ?, 'INVALID')
        `;

        // Affichage de la requête SQL avant l'exécution
        console.log("Exécution de la requête pour insérer la recette : ", insertRecipeQuery, [name, instructions, category]);

        db.run(insertRecipeQuery, [name, instructions, category], function(err) {
            if (err) {
                console.error("Erreur lors de l'insertion de la recette : ", err.message);  // Afficher le message d'erreur détaillé
                return res.status(500).send("Erreur lors de l'insertion de la recette.");
            }

            console.log("Recette insérée avec succès, ID de la recette : ", this.lastID);

            // 2. Utiliser directement lastID pour l'ID de la recette insérée
            const recipeId = this.lastID; // ID de la recette insérée
            console.log("ID de la recette récupéré : ", recipeId);

            // 3. Insertion des ingrédients dans la table `RECIPE_INGREDIENT`
            const insertIngredientQuery = `
                INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
                VALUES (?, ?, ?, ?)
            `;
            console.log("Exécution de la requête pour insérer les ingrédients : ", insertIngredientQuery);

            // Insertion des ingrédients
            ingredients.forEach(ingredient => {
                const { name, quantity, unit } = ingredient;

                db.run(insertIngredientQuery, [recipeId, name, quantity, unit], (err) => {
                    if (err) {
                        console.error("Erreur lors de l'insertion des ingrédients : ", err.message);
                        return res.status(500).send("Erreur lors de l'insertion des ingrédients.");
                    }
                });
            });

            // Si tout est bien inséré, renvoyer une réponse de succès
            res.status(200).send("Recette et ingrédients ajoutés avec succès !");
        });
    });
});




router.use('/', function (req, res) {
	res.render('submit.ejs', {logged: req.session.loggedin});
});

module.exports = router;