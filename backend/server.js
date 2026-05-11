const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());    

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_chaine_depense'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à MySQL:', err);
        return;
    }
    console.log('Connecté à la base de données db_chaine_depense');
});

//Route pour tester si ça marche
app.get('/', (req, res) => {
    res.send('Le serveur backend fonctionne correctement!');
});

app.listen(3001, () => {
    console.log('Serveur backend en écoute sur le port 3001');
});  