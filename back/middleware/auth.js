const jwt = require('jsonwebtoken');
require('dotenv').config();
 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;
        const status = decodedToken.status;
        req.auth = {
            userId: userId,
            status: status
        };
	    next();
    } catch(error) {
       res.status(401).json({message: 'Utilisateur non autorisé.'});
    }
};