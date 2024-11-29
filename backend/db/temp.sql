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
    difficulty VARCHAR(10) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    instructions VARCHAR(1000),
    status VARCHAR(10) CHECK (status IN ('VALID', 'INVALID')) DEFAULT 'INVALID'
);

CREATE TABLE RECIPE_INGREDIENT (
    recipeId INTEGER, 
    ingredient VARCHAR(50),
    importance VARCHAR(20),
    quantity FLOAT,
    unit VARCHAR(20),
    FOREIGN KEY (recipeId) REFERENCES RECIPE(recipeId),
    PRIMARY KEY (recipeId, ingredient)
);

INSERT INTO ADMIN VALUES ("admin","b77ad2edf199a4b4479347afaf387d435a12480d0dc5b8e042c4c8991587d0808c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918","admin@insa-rouen.fr");
/* le mdp hashé est 'admin' */