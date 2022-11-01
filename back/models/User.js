const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Model d'utilisateur ajouté à la base de donnée
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: true },
    bio: { type: String, required: true },
    status: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);