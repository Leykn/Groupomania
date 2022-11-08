const fs = require('fs');
const Post = require('../models/Post');

const regexInputs = /^[a-zA-Z0-9 \_\.\-\,\'\!\(\)\r\&ôéêèàçùîï]+$/m;

// Récupère une requête et l'enregistre dans la base de donnée
exports.createPost = (req, res) => {
    try {
    if (req.file) {
        const postObject = JSON.parse(req.body.post);
        delete postObject._id;
        delete postObject._userId;
        if(!regexInputs.test(postObject.title)|| 
            !regexInputs.test(postObject.content)){
            return res.status(400).json({message : "Certains champs sont renseignés avec des caractères invalides"})
        }
        const img = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        const post = new Post({
            ...postObject,
            userId: req.auth.userId,
            date: Date.now(),
            imageUrl: img,
            likes: 0,
            usersLiked: []
        });
        post.save()
            .then(() => {return res.status(201).json({ message: 'Post Enregistré !'})})
            .catch( error => {return res.status(400).json({ error })});
    } else {
        const postObject = req.body;
        delete postObject._id;
        delete postObject._userId;
        if(!regexInputs.test(postObject.title)|| 
            !regexInputs.test(postObject.content)){
            return res.status(400).json({message : "Certains champs sont renseignés avec des caractères invalides"})
        }
        const img = ' '
        const post = new Post({
            ...postObject,
            userId: req.auth.userId,
            date: Date.now(),
            imageUrl: img,
            likes: 0,
            usersLiked: []
        });
        post.save()
            .then(() => {return res.status(201).json({ message: 'Post Enregistré !'})})
            .catch( error => {return res.status(400).json({ error })});
    }
    } catch (error) {
        res.status(500).json({ error })
    }
};

// Modification d'un objet existant
exports.modifyPost = (req, res) => {
    const body = req.body.bool ? {
        ...req.body,
        imageUrl: ' '
    } : { ...req.body };

    const postObject = req.file ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : body;

    delete postObject.bool;
    delete postObject._userId;
    Post.findOne({_id: req.params.id})
        .then((post) => {
            if ((post.userId != req.auth.userId) && (post.userId != req.auth.userId && req.auth.status !== 'admin')) {
                return res.status(400).json({ message: 'Non-autorisé !' });
            } else if(!regexInputs.test(postObject.title)|| 
            !regexInputs.test(postObject.content)){
                return res.status(400).json({message : "Certains champs sont renseignés avec des caractères invalides"})
            } else {
            if (req.file || postObject.imageUrl === ' ') {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {});
            }
            Post.updateOne({ _id: req.params.id}, {...postObject, _id: req.params.id})
                .then(() => res.status(200).json({ message: 'Post modifié !'}))
                .catch( error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ message: error}));
};

// Suppression d'un objet
exports.deletePost = (req, res) => {
    Post.findOne({ _id: req.params.id})
        .then(post => {
        if ((post.userId != req.auth.userId) && (post.userId != req.auth.userId && req.auth.status !== 'admin')) {
            res.status(401).json({ message: 'Non-autorisé !' });
        } else {
            if (post.imageUrl !== ' ') {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {});
            }
            Post.deleteOne({ _id: req.params.id})
                .then(() => res.status(200).json({ message: 'Post Supprimé !'}))
                .catch( error => res.status(401).json({ error }));
        }
        })
        .catch( error => res.status(500).json({ error }));
};

// Recherche un objet dans la base de donnée avec le paramettre 'id'
exports.getOnePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then( post => res.status(200).json(post))
        .catch( error => res.status(400).json({ error }));
};

// Envoi la liste des messages trié de façon antéchronologique
exports.getAllPost = (req, res) => {
    Post.find().sort({"date":-1})
        .then(post => res.status(200).json(post))
        .catch( error => res.status(400).json({ error }));
};

// Modification du nombre de like et du tableau d'utilisateur ayant aimé le message
exports.like = (req, res) => {
    Post.findOne({ _id: req.params.id})
        .then((post) => {
            if (req.body.like === 1) {
                Post.updateOne({ _id: req.params.id}, {$inc: {likes: +1}, $push: {usersLiked: req.body.userId}})
                    .then(() => res.status(200).json({ message: "L'utilisateur à like la sauce !" }))
                    .catch( error => res.status(400).json({ error }));
            } else if (req.body.like === 0) {
                Post.updateOne({ _id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
                .then(() => res.status(200).json({ message: "Le like a été retiré !" }))
                .catch( error => res.status(400).json({ error }));
            } else {
                res.status(400).json({message: 'Une erreur est survenue.'})
            }
        })
};