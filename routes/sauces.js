// appels des dependances:
const express = require('express');
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config.js');
const router = express.Router();

// appel des fonctions (implementées dans controllers et middleware) dans les differentes routes sauce: 
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/' + '', auth, saucesCtrl.getAllSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

// export du routeur Express pour utilisation dans d'autres fichiers:
module.exports = router;