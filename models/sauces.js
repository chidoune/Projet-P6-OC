// appel dependance:
const mongoose = require('mongoose');

// creation du schema de donnees pour une sauce:
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default :0 },
  dislikes: { type: Number, default:0 },
  imageUrl: { type: String },
  mainPepper: { type: String, required: true },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
  userId: { type: String, required: true }
});

// export du modele Sauce pour le rendre dispo pour l'appli:
module.exports = mongoose.model('Sauce', sauceSchema);