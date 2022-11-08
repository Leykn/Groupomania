const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

// Enregistre l'email et le MDP hashé dans la base de donnée
router.post('/signup', userCtrl.signup);
// Vérifie si l'utilisateur est inscrit, puis si le MDP est correct
router.post('/login', userCtrl.login);
// Modifie un utilisateur existant
router.put('/:id', auth, multer, userCtrl.modifyUser);
// Modifie le mot de passe utilisateur
router.put('/password/:id', auth, userCtrl.modifyUserPassword);
// suppression d'un utilisateur
router.delete('/:id', auth, userCtrl.deleteUser);
// Récupère la liste des utilisateurs
router.get('/', auth, userCtrl.getAllUsers);
// Récupère un utilisateur spécifique
router.get('/:id', auth, userCtrl.getOneUser);
// Récupère l'utilisateur de la requète
router.get('/user/:id', auth, userCtrl.getCurrentUser);
// Met à jour le token d'authentification
router.post('/refreshToken', userCtrl.refreshToken);

module.exports = router;