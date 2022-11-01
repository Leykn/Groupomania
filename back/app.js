// Importe les modules et script
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

require('dotenv').config();
const dbUserName = process.env.dbUserName;
const dbPassword = process.env.dbPassword;

// Connection à la base de donnée de MongoDB
mongoose.connect(`mongodb+srv://${dbUserName}:${dbPassword}@cluster${dbUserName}.bj1humk.mongodb.net/Groupomania?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Middleware
app.use(express.json());

// Autorise les réponses d'origine différentes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet({ 
  crossOriginResourcePolicy: { 
      policy: "same-site" 
  } 
}));
app.disable('x-powered-by');

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;