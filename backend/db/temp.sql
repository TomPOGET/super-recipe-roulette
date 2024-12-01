/* Ce fichier contient les requêtes à executer pour créer la bd, afin de transformer le en format finale (.sqlite), appliquez la commande:
    sqlite3 reciperoulette.sqlite < temp.sql
*/

DROP TABLE ADMIN ;
DROP TABLE RECIPE ;
DROP TABLE RECIPE_INGREDIENT ;

CREATE TABLE ADMIN (
    username VARCHAR(50) PRIMARY KEY,  
    password VARCHAR(70),  -- Augmenté pour le mot de passe hashé
    email VARCHAR(40)
);

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
