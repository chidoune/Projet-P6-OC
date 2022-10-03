// appel de la dependance:
const passwordValidator = require('password-validator');

// creation d'un schema de contraintes pour le password:
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)
    .is().max(20)
    .has().uppercase(1)
    .has().uppercase()
    .has().digits()
    .has().not().spaces();

// creation fonction qui verifie validité du password:
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
     next();
    }
    else {
    res.writeHead(402, 'Votre mot de passe ne doit pas contenir d\'espace et doit contenir au moins 8 caractères, 1 majuscule et 1 chiffre svp.')
    res.end('Votre mot de passe ne doit pas contenir d\'espace et doit contenir au moins 8 caractères, 1 majuscule et au moins 1 chiffre')
    }
};