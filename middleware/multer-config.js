// appel de la dependance:
const multer = require('multer');

// objet MIME-TYPES :
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// creation objet de configuration de multer (gestion destination de l'enregistrement + nom unique image):
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// export multer configuré pour utilisation dans d'autres fichiers:
module.exports = multer({storage: storage}).single('image');