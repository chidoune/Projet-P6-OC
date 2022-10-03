// definition d'une regex pour adresse email:
const emailRegex =
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// creation fonction qui verifie validité de l'email selon correspondance avec regex definit:
module.exports = (req, res, next) => {
    if (req.body.email.match(emailRegex) !== null) {
     next();
    }
    else {
    res.writeHead(402, 'Votre adresse mail n\'est pas valide ! Merci de de renseigner votre adresse mail svp.')
    res.end('Votre adresse mail n\'est pas valide ! Merci de de renseigner votre adresse mail svp.')
    }
};