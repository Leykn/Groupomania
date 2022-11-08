const bcrypt = require('bcrypt');
const cryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const User = require('../models/User');

const mailValidator = require('email-validator');
const passwordValidator = require('password-validator');

const schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)
.is().max(16)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.has().symbols()
.is().not().oneOf(['Passw0rd', 'Password123']);


const regexInputs = /^[a-zA-Z0-9 \_\.\-\,\'\?\!\(\)\r\&ôéêèàçùîï]+$/m;

// Enregistre l'email et le MDP hashé dans la base de donnée
exports.signup = (req, res) => {
    if(!mailValidator.validate(req.body.email)){
        return res.status(500).json({message : "Adresse email non valide."})
     } else if (!schema.validate(req.body.password)){
        return res.status(500).json({message : "Mot de passe non valide - Utilisez des majuscules, minuscules, chiffres et symboles, aucun espace, pour 8(min) à 16(max) caractères."})
     } else {
        const cryptMail = cryptoJs.SHA256(req.body.email, process.env.EMAIL_CRYPT_KEY).toString();
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    username: req.body.username,
                    email: cryptMail,
                    password: hash,
                    imageUrl: 'http://localhost:3000/images/default_avatar.png',
                    bio: ' ',
                    status: req.body.status,
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur Créé !'}))
                    .catch( error => res.status(400).json({ message: error }));
            })
            .catch( error => res.status(500).json({ error }));
     }
};

// Vérifie si l'utilisateur est inscrit, puis si le MDP est correct
exports.login = (req, res) => {
    const cryptMail = cryptoJs.SHA256(req.body.email, process.env.EMAIL_CRYPT_KEY).toString();
    User.findOne({ email: cryptMail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'pair login / mot de passe incorrecte.'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'pair identifiant / mot de passe incorrecte.'});
                    }
                    let accessToken = jwt.sign({userId: user._id, status: user.status },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: '1800s'}
                        );
                    let refreshToken = jwt.sign({ userId: user._id, status: user.status },
                        process.env.REFRESH_TOKEN_SECRET,
                        {expiresIn: '7d'}
                        );
                    res.status(200).json({
                        userId: user._id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        status: user.status
                    });
                })
                .catch( error => res.status(500).json({ error }));
            }
        )
        .catch( error => res.status(500).json({ error }));
};

// Modification de l'utilisateur après vérification d'autorisation
exports.modifyUser = (req, res) => {
    const body = req.body.bool ? {
        ...req.body,
        imageUrl: 'http://localhost:3000/images/default_avatar.png'
    } : { ...req.body };

    const userObject = req.file ? {
        ...JSON.parse(req.body.user),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : body;

    delete userObject.bool;
    User.findOne({_id: req.params.id})
        .then(user => {
            if (user._id != req.auth.userId) {
                return res.status(400).json({ message: 'Non-autorisé !' });
            } else if (!regexInputs.test(userObject.username)|| 
            !regexInputs.test(userObject.bio)){
                return res.status(400).json({message : "Certains champs sont renseignés avec des caractères invalides"})
            } else {
                if (userObject.imageUrl) {
                    if (user.imageUrl !== 'http://localhost:3000/images/default_avatar.png') {
                        const filename = user.imageUrl.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {});
                    }
                }
                User.updateOne({ _id: req.params.id}, {...userObject, _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Utilisateur modifié !'}))
                    .catch( error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

// Modification du mot de passe après vérification d'autorisation
exports.modifyUserPassword = (req, res) => {
    User.findOne({_id: req.params.id})
        .then((user) => {
            if (user._id != req.auth.userId) {
                return res.status(400).json({ message: 'Non-autorisé !' });
            } else if (!schema.validate(req.body.newPassword)){
                return res.status(500).json({message : "Mot de passe non valide - Utilisez des majuscules, minuscules, chiffres et symboles, aucun espace, pour 8(min) à 16(max) caractères."})
             } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: 'Mot de passe incorrecte.'});
                        }
                        bcrypt.hash(req.body.newPassword, 10)
                            .then(hash => {
                            User.updateOne({ _id: req.params.id}, { password: hash, _id: req.params.id})
                                .then(() => res.status(200).json({ message: 'Utilisateur modifié !'}))
                                .catch( error => res.status(401).json({ error }));
                            });
                    })
                    .catch( error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

// Suppression de l'utilisateur après vérification d'autorisation
exports.deleteUser = (req, res) => {
    User.findOne({ _id: req.params.id})
        .then(user => {
            if ((user._id != req.auth.userId) && (user._id != req.auth.userId && req.auth.status !== 'admin')) {
                res.status(401).json({ message: 'Non-autorisé !' });
            } else {
                if (user.imageUrl !== 'http://localhost:3000/images/default_avatar.png') {
                    const filename = user.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {});
                }
                User.deleteOne({ _id: req.params.id})
                    .then(() => res.status(200).json({ message: 'Utilisateur Supprimé !'}))
                    .catch( error => res.status(401).json({ error }));
            }
        })
        .catch( error => res.status(500).json({ error }));
};

// Envoi les données de l'utilisateur actuel
exports.getCurrentUser = (req, res) => {
    User.findOne({ _id: req.auth.userId })
        .then( user => {res.status(200).json(user)})
        .catch( error => res.status(400).json({ error }));
};

// Envoi les données de l'utilisateur spécifié
exports.getOneUser = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then( user => {res.status(200).json(user)})
        .catch( error => res.status(400).json({ error }));
};

// Envoi la liste des utilisateur trié par ordre croissant alphabétique
exports.getAllUsers = (req, res) => {
    User.find().sort({"username":1})
        .then( user => res.status(200).json(user))
        .catch( error => res.status(400).json({ error }));
};

// Met à jour l'accessToken après vérification du refreshToken
exports.refreshToken = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401);
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({message: 'Veuillez vous identifier.'});
        }
        const userId = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET).userId;
        User.findOne({ _id: userId })
            .then(user => {
                if (!user) {
                    return res.status(401).json({message: 'Utilisateur introuvable.'});
                }
                delete user.iat;
                delete user.exp;
                const refreshToken = jwt.sign({ userId: user._id, status: user.status }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
                res.status(200).json({accessToken: refreshToken, status: user.status})
            })
            .catch( error => res.status(500).json({ error }));
    });
}