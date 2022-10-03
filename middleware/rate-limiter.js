const rateLimit = require('express-rate-limit'); 

module.exports = rateLimit({
    windowMs: 3 * 60 * 1000, 
    max: 3, 
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 3 minutes !'
});
