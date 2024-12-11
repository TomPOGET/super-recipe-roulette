/* Ce fichier contient les requêtes à executer pour créer la bd, afin de transformer le en format finale (.sqlite), appliquez la commande:
    sqlite3 reciperoulette.sqlite < temp.sql   dans backend/db
*/

DROP TABLE ADMIN ;
DROP TABLE RECIPE ;
DROP TABLE RECIPE_INGREDIENT ;

CREATE TABLE ADMIN (
    username VARCHAR(50) PRIMARY KEY,  
    password VARCHAR(70),  -- Augmenté pour le mot de passe hashé
    email VARCHAR(40)
);

/* Les images des recettes seront stockés dans le serveur (img/recipes)*/
CREATE TABLE RECIPE (
    recipeId INTEGER PRIMARY KEY AUTOINCREMENT,  -- Utilisation d'AUTOINCREMENT en SQLite, au lieu de serial (pgsql)
    name VARCHAR(30),
    category VARCHAR(15) CHECK (category IN ('ENTREE', 'PRINCIPAL', 'DESSERT', 'BOISSON', 'AUTRES')),
    instructions VARCHAR(1000),
    status VARCHAR(10) CHECK (status IN ('VALID', 'INVALID')) DEFAULT 'INVALID'
);

CREATE TABLE RECIPE_INGREDIENT (
    recipeId INTEGER, 
    ingredient VARCHAR(50),
    quantity FLOAT,
    unit VARCHAR(20),
    FOREIGN KEY (recipeId) REFERENCES RECIPE(recipeId),
    PRIMARY KEY (recipeId, ingredient)
);

INSERT INTO ADMIN VALUES ("admin","8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918","admin@insa-rouen.fr");
/* le mdp hashé est 'admin' */






/* Ici on insère nos recettes */
-- Salade de tomates
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Salade de tomates", "ENTREE", "Couper des tomates en tranches, ajouter du sel, de l'huile d'olive et du vinaigre.", "VALID");

-- Pâtes à la sauce tomate
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Pâtes à la sauce tomate", "PRINCIPAL", "Faire cuire des pâtes, puis préparer une sauce tomate avec des tomates en conserve, de l'ail et du basilic.", "VALID");

-- Gâteau au chocolat
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Gâteau au chocolat", "DESSERT", "Mélanger farine, cacao, œufs, sucre, beurre, puis cuire à 180°C pendant 30 minutes.", "VALID");

-- Smoothie à la banane
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Smoothie à la banane", "BOISSON", "Mixer une banane, du lait, et un peu de sucre pour un smoothie crémeux.", "VALID");

-- Omelette
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Omelette", "PRINCIPAL", "Battre des œufs, les cuire dans une poêle chaude avec un peu de beurre.", "VALID");



/* Ici on insère les ingrédients de chacune des recettes */

-- Ingrédients pour la Salade de tomates
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (1, "Tomates", 3, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (1, "Sel", 1, "cuillère à café");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (1, "Huile d'olive", 2, "cuillères à soupe");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (1, "Vinaigre", 1, "cuillère à soupe");

-- Ingrédients pour les Pâtes à la sauce tomate
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (2, "Pâtes", 200, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (2, "Tomates en conserve", 400, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (2, "Ail", 2, "gousses");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (2, "Basilic", 1, "branche");

-- Ingrédients pour le Gâteau au chocolat
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (3, "Farine", 200, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (3, "Cacao en poudre", 50, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (3, "Œufs", 3, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (3, "Sucre", 150, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (3, "Beurre", 100, "grammes");

-- Ingrédients pour le Smoothie à la banane
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (4, "Banane", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (4, "Lait", 250, "millilitres");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (4, "Sucre", 1, "cuillère à soupe");

-- Ingrédients pour l'Omelette
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (5, "Œufs", 3, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (5, "Beurre", 1, "cuillère à soupe");




/* Nouvelles recettes */

-- Soupe de légumes
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Soupe de légumes", "ENTREE", "Faire bouillir des légumes variés avec du bouillon, puis mixer pour obtenir une soupe lisse.", "VALID");

-- Poulet rôti
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Poulet rôti", "PRINCIPAL", "Assaisonner un poulet entier, le cuire au four à 200°C pendant 1 heure 30.", "VALID");

-- Tarte aux pommes
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Tarte aux pommes", "DESSERT", "Disposer des tranches de pommes sur une pâte, saupoudrer de sucre, cuire à 180°C pendant 40 minutes.", "VALID");

-- Thé glacé maison
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Thé glacé maison", "BOISSON", "Infuser du thé, ajouter du sucre et du citron, laisser refroidir au réfrigérateur.", "VALID");

-- Riz sauté aux légumes
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Riz sauté aux légumes", "PRINCIPAL", "Faire revenir des légumes dans une poêle, ajouter du riz cuit et des sauces.", "VALID");


/* Ingrédients pour les nouvelles recettes */

-- Ingrédients pour la Soupe de légumes
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (6, "Carottes", 2, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (6, "Pommes de terre", 2, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (6, "Bouillon de légumes", 500, "millilitres");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (6, "Sel", 1, "cuillère à café");

-- Ingrédients pour le Poulet rôti
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (7, "Poulet entier", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (7, "Sel", 1, "cuillère à café");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (7, "Poivre", 1, "cuillère à café");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (7, "Herbes de Provence", 2, "cuillères à soupe");

-- Ingrédients pour la Tarte aux pommes
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (8, "Pommes", 4, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (8, "Pâte brisée", 1, "rouleau");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (8, "Sucre", 50, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (8, "Cannelle", 1, "cuillère à café");

-- Ingrédients pour le Thé glacé maison
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (9, "Thé noir", 2, "sachets");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (9, "Eau", 1, "litre");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (9, "Sucre", 2, "cuillères à soupe");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (9, "Citron", 1, "unité");

-- Ingrédients pour le Riz sauté aux légumes
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (10, "Riz cuit", 200, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (10, "Carottes", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (10, "Poivrons", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (10, "Sauce soja", 2, "cuillères à soupe");






/* 10 Nouvelles recettes */

-- Guacamole
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Guacamole", "ENTREE", "Écraser des avocats, ajouter du jus de citron, de l'oignon haché et des épices.", "VALID");

-- Pizza Margherita
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Pizza Margherita", "PRINCIPAL", "Étaler une pâte à pizza, ajouter de la sauce tomate, de la mozzarella et cuire au four.", "VALID");

-- Mousse au chocolat
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Mousse au chocolat", "DESSERT", "Faire fondre du chocolat, ajouter des blancs d'œufs montés en neige et refroidir.", "VALID");

-- Limonade maison
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Limonade maison", "BOISSON", "Mélanger du jus de citron, du sucre, de l'eau et des glaçons pour une limonade fraîche.", "INVALID");

-- Curry de légumes
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Curry de légumes", "PRINCIPAL", "Faire mijoter des légumes dans une sauce curry à base de lait de coco et d'épices.", "INVALID");

-- Crêpes
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Crêpes", "DESSERT", "Mélanger farine, œufs, lait et beurre, puis cuire dans une poêle chaude.", "VALID");

-- Chocolat chaud
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Chocolat chaud", "BOISSON", "Faire chauffer du lait avec du chocolat noir et sucrer à votre goût.", "VALID");

-- Ratatouille
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Ratatouille", "PRINCIPAL", "Faire mijoter des courgettes, aubergines, poivrons, et tomates avec de l'huile d'olive et des herbes.", "VALID");

-- Bruschetta
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Bruschetta", "ENTREE", "Griller des tranches de pain, ajouter des tomates hachées, de l'ail, du basilic et un filet d'huile d'olive.", "INVALID");

-- Brownies
INSERT INTO RECIPE (name, category, instructions, status)
VALUES ("Brownies", "DESSERT", "Mélanger farine, chocolat fondu, œufs, sucre et beurre, puis cuire au four.", "VALID");


/* Ingrédients pour les nouvelles recettes */

-- Ingrédients pour le Guacamole
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (11, "Avocats", 2, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (11, "Citron", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (11, "Oignon", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (11, "Sel", 1, "cuillère à café");

-- Ingrédients pour la Pizza Margherita
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (12, "Pâte à pizza", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (12, "Sauce tomate", 150, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (12, "Mozzarella", 200, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (12, "Basilic", 1, "branche");

-- Ingrédients pour la Mousse au chocolat
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (13, "Chocolat noir", 200, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (13, "Œufs", 3, "unités");

-- Ingrédients pour la Limonade maison
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (14, "Citron", 3, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (14, "Eau", 1, "litre");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (14, "Sucre", 50, "grammes");

-- Ingrédients pour le Curry de légumes
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (15, "Carottes", 2, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (15, "Pommes de terre", 2, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (15, "Lait de coco", 400, "millilitres");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (15, "Curry", 2, "cuillères à café");

-- Ingrédients pour les Crêpes
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (16, "Farine", 200, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (16, "Œufs", 2, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (16, "Lait", 500, "millilitres");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (16, "Beurre", 50, "grammes");

-- Ingrédients pour le Chocolat chaud
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (17, "Lait", 250, "millilitres");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (17, "Chocolat noir", 50, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (17, "Sucre", 1, "cuillère à café");

-- Ingrédients pour la Ratatouille
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (18, "Courgettes", 2, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (18, "Aubergines", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (18, "Poivrons", 1, "unité");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (18, "Tomates", 3, "unités");

-- Ingrédients pour la Bruschetta
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (19, "Pain", 4, "tranches");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (19, "Tomates", 2, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (19, "Basilic", 1, "branche");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (19, "Huile d'olive", 2, "cuillères à soupe");

-- Ingrédients pour les Brownies
INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (20, "Farine", 150, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (20, "Chocolat noir", 200, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (20, "Œufs", 3, "unités");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (20, "Sucre", 100, "grammes");

INSERT INTO RECIPE_INGREDIENT (recipeId, ingredient, quantity, unit)
VALUES (20, "Beurre", 100, "grammes");

