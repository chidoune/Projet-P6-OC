// appels des dependances:
const express = require('express');
const userCtrl = require('../controllers/user');
const router = express.Router();
const limiter = require('../middleware/rate-limiter');
const password = require('../middleware/password');
const mailRegex = require('../middleware/mail-regex');


// appel des fonctions (implementées dans controllers et middleware) dans les differentes routes user: 
router.post('/signup', mailRegex, password, userCtrl.signup);
router.post('/login', mailRegex, password, limiter, userCtrl.login);

// export du routeur Express pour utilisation dans d'autres fichiers:
module.exports = router;