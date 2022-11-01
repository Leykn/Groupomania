const mongoose = require('mongoose');

// Model de post ajouté à la base de donnée
const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    date: { type: Number, required: true },
    likes: { type: Number, required: true },
    usersLiked: { type: ["String <userId>"], required: true },
});

module.exports = mongoose.model('Post', postSchema);