// appels des dependances:
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// creation du schema de donnees pour un user:
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// utilisation plugin "uniqueValidator" sur le schema user (securité = adresse mail unique):
userSchema.plugin(uniqueValidator);

// export du modele User pour le rendre dispo pour l'appli:
module.exports = mongoose.model('User', userSchema);