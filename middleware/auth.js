// appel de la dependance:
const jwt = require('jsonwebtoken');

/* export fonction qui permet authentification des requetes -> recuperation du token requete, 
** verification correspondance entre celui-ci et celui bdd, 
** + recuperation du userId du token decodé et transmission du userId dans requetes (+ gestion erreur): */
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};