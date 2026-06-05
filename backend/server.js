const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Configuration avancée de CORS pour le tunnel VS Code et Netlify
app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://chainededepenseform.netlify.app',
        'https://np8wrqnf-3001.app.online.visualstudio.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'bypass-tunnel-reminder', 'x-tunnel-skip-anti-phishing-warning'],
    credentials: true
}));

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
        SELECT t.*, 
               b.id as beneficiaire_id, b.nom as beneficiaire_nom, b.type_beneficiaire as beneficiaire_type, b.service_prestataire as beneficiaire_service,
               ba.id as banque_id, ba.nom_banque, ba.num_compte, ba.mode_paiement
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
        const transferts = results.map(row => ({
            ...row,
            beneficiaire: row.beneficiaire_id ? {
                id: row.beneficiaire_id,
                nom: row.beneficiaire_nom,
                type_beneficiaire: row.beneficiaire_type,
                service_prestataire: row.beneficiaire_service
            } : null,
            banque: row.banque_id ? {
                id: row.banque_id,
                nom_banque: row.nom_banque,
                num_compte: row.num_compte,
                mode_paiement: row.mode_paiement
            } : null
        }));
        res.json(transferts);
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