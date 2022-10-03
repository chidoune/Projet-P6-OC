// appel des dependances:
const Sauce = require('../models/sauces');
const fs = require('fs');

/* fonction qui permet creation d'une sauce -> recuperation du body sauce avec suppresion id_sauce et id_utilisateur provenant du front,
** creation d'une sauce avec body actualisé (avec notament generation url de l'image), enregistrement de la sauce dans bdd (+ gestion erreur): */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
  .catch(error => { res.status(400).json( { error })})
};

/* fonction qui permet modification d'une sauce:
** si image, recuperation sauce avec transformation en format objet et generation de l'url de la nouvelle image,
** sinon, recuperation sauce déjà au format objet,
** suppression de l'user_id provenant du front, recuperation de la sauce,
** puis authentification requete, suppression ancienne image puis mise à jour sauce dans bdd ( + gestion erreurs): */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };
delete sauceObject._userId;
Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({ message : 'Accès non autorisé !'});
        } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
            .catch(error => res.status(401).json({ error }));
          });
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

/* fonction qui permet suppression d'une sauce -> recuperation sauce puis authentification requete
** et suppression image + suppresion sauce de la bdd (+ gestion erreurs) : */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
      if (sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Accès non autorisé !'});
      } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
};

// fonction qui permet recuperation d'une sauce (+ gestion erreur):
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

// // fonction qui permet recuperation toutes les sauces (+ gestion erreur):
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({ error }));
};

/* fonction qui permet de liker ou disliker une sauce :
** recuperation du status de like (+1, 0 ou -1) et recuperation de l'id_utilisateur (id provenant du front), plusieurs cas possibles :
** ___ statut de like = 1 : mise à jour sauce dans bdd, push du id_user dans le tableau des likes et incrémentation des likes pour la sauce.
** ___ statut de like = 0 : recuperation de la sauce, puis: 
** -> si le user avait liké alors il est retiré du tableau des likes et le like est retiré, mise à jour de la sauce dans la bdd,
** -> si le user avait disliké, il est retiré du tableau des dislikes et le dislike est retiré, mise à jour de la sauce dans la bdd,
** ___ statut de like = - 1 : mise à jour sauce dans bdd, push du id_user dans le tableau des dislikes et incrémentation des dislikes pour la sauce.
** (+ gestion des erreurs): */
exports.likeSauce = (req, res, next) => {
  let likeStatus = req.body.like
  let userId = req.body.userId
  console.log(likeStatus)
  switch(likeStatus) {
    case 1:
      Sauce.updateOne({_id: req.params.id}, {$push:{usersLiked: userId}, $inc: {likes: +1}})
      .then(() => res.status(200).json({message : 'Like ajouté -) !'}))
      .catch(error => res.status(401).json({ error }))
      break;

    case 0: 
      Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
         if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({_id: req.params.id}, {$pull: {usersLiked: userId}, $inc: {likes: -1}})
          .then(() => res.status(200).json({message : 'Like retiré -( !'}))
          .catch(error => res.status(401).json({ error }))
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: userId}, $inc: {dislikes: -1}})
          .then(() => res.status(200).json({message : 'Dislike retiré -) !'}))
          .catch(error => res.status(401).json({ error }))
        }
      })
      .catch(error => res.status(401).json({ error }))
      break;

      case -1:
      Sauce.updateOne({_id: req.params.id}, {$push:{usersDisliked: userId}, $inc: {dislikes: +1}})
      .then(() => res.status(200).json({message : 'Dislike ajouté -( !'}))
      .catch(error => res.status(401).json({ error }))
      break;
  }
};