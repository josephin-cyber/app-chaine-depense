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

// Route pour tester si ça marche
app.get('/', (req, res) => {
    res.send('Le serveur backend fonctionne correctement!');
});

// GET all transferts
app.get('/api/transferts', (req, res) => {
    const sql = `
        SELECT t.*, b.nom as beneficiaire_nom, ba.nom_banque as banque_nom
        FROM transferts t
        LEFT JOIN beneficiaires b ON t.fk_beneficiaire_id = b.id
        LEFT JOIN banques ba ON t.fk_banque_id = ba.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des transferts:', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        res.json(results);
    });
});

// GET all beneficiaires
app.get('/api/beneficiaires', (req, res) => {
    const sql = 'SELECT * FROM beneficiaires';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des bénéficiaires:', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        res.json(results);
    });
});

// GET all banques
app.get('/api/banques', (req, res) => {
    const sql = 'SELECT * FROM banques';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des banques:', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        res.json(results);
    });
});

// POST a new transfert
app.post('/api/transferts', (req, res) => {
    const { num_opi, num_depense, num_dossier, imputation, num_od, objet_opi, montant, date_emission, signataire_nom, fk_beneficiaire_id, fk_banque_id } = req.body;
    const sql = `
        INSERT INTO transferts (num_opi, num_depense, num_dossier, imputation, num_od, objet_opi, montant, date_emission, signataire_nom, fk_beneficiaire_id, fk_banque_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [num_opi, num_depense, num_dossier, imputation, num_od, objet_opi, montant, date_emission, signataire_nom, fk_beneficiaire_id, fk_banque_id];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du transfert:', err);
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        res.json({ id: result.insertId, ...req.body });
    });
});

app.listen(3001, () => {
    console.log('Serveur backend en écoute sur le port 3001');
});