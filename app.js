const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const methodOverride = require('method-override');

//Initialisation du serveur express
const server = express();

//le middleware pour effectuer une suppression(delete)
server.use( function( req, res, next ) {
  if ( req.query._method == 'DELETE' ) {
      req.method = 'DELETE';
      req.url = req.path;
  }       
  next(); 
});
server.use(methodOverride('_method'));

//Configuration de la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'thythythesy',
  database: 'kda_test',
  password: '123',
});

//Connexion à la base de données
connection.connect((erreur) => {
  if (erreur) {
    throw erreur;
  }
  console.log('La connexion à la base de données est établie');
});

//Dire à express de mettre les données venants du formulaire dans BODY
server.use(express.urlencoded({ extended: false }));

//Dire à express où aller trouver les vues(Nos pages web que le user sait voir)
server.set('views');

//Dire à express d'utiliser EJS comme moteur de template
server.set('view engine', 'ejs');

server.get('/apprenants', (req, res) => {
  connection.query('select * from students', (erreur, resultat) => {
    if (erreur) throw erreur;
    return res.render('apprenants/index', { apprenants: resultat });
  });
});
// POST
server.post('/apprenants', (req, res) => {
  console.log('BB');
  connection.query(
    `insert into students(nom,prenom) values('${req.body.nom}','${req.body.prenom}')`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.redirect('/apprenants');
    }
  );
});

server.get('/apprenants/new', (req, res) => {
  return res.render('apprenants/new');
});

server.get('/apprenants/:id', (req, res) => {
  connection.query(
    `select * from students where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.render('apprenants/show', { apprenant: resultat[0] });
    }
  );
});

server.get('/apprenants/modifier/:id', (req, res) => {
  connection.query(
    `select * from students where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.render('apprenants/modifier', { apprenant: resultat[0] });
    }
  );
});


//PUT
server.put('/apprenants/modifier/:id', (req, res) => {
  console.log('Mise à jour effectuée');
  connection.query(
    `UPDATE students SET nom="${req.body.nom}",prenom="${req.body.prenom}" WHERE id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.redirect('/apprenants');
    }
  );
});

// DELETE
server.delete('/apprenants/supprimer/:id', (req, res)=>{
  console.log('Enregistrement est supprimé')
  connection.query(
    `delete from students where id=${req.params.id}`,
    (erreur, resultat)=>{
      if(erreur) throw erreur;
      return res.redirect('/apprenants');
    } 
  );
});


//Définition du port
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
