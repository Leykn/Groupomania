const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

// Récupère un post et l'enregistre en base de donnée
router.post('/create', auth, multer, postCtrl.createPost);
// Modifie un post existant
router.put('/:id', auth, multer, postCtrl.modifyPost);
// suppression d'un post
router.delete('/:id', auth, postCtrl.deletePost);
// Retourne le post avec le paramètre id
router.get('/:id', auth, postCtrl.getOnePost);
// Retourne tous les posts
router.get('/', auth, postCtrl.getAllPost);
// Définit le status like du post
router.post('/:id/like', auth, postCtrl.like);

module.exports = router;