// appels des dependances:
const express = require('express');
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');

// configuration de dotenv:
dotenv.config();

const userMongoDb = process.env.USER_MONGODB; 
const passwordMongoDb = process.env.PASSWORD_MONGODB;
const clusterMongoDb = process.env.CLUSTER_MONGODB;
console.log(userMongoDb);

// creation d'une appli express: 
const app = express();

// middleware qui permet securisation de l'appli en définissant les differents en tete headers HTTP:
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));

// connexion de l'API à la base de donnees MongoDB et message de verification de reussite de connexion dans le console Node:
mongoose.connect('mongodb+srv://chidoune:JesuisRachida1984@cluster0.mq961vr.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// middleware qui extrait et donne accès au corps d'une requete:
app.use(express.json());

// middlewares generaux (=sans route) pour resoudre les erreurs de CORS (= ok pour toutes origines, certains headers et certaines methodes):
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(cors());

// middlewares d'enregistrement du routeur pour toutes les demandes vers les routes indiquées:
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// export de l'appli pour possibilité de reutilisation dans d'autres fichiers:
module.exports = app;
