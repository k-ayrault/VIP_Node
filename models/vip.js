let db = require('../configDb');

//Récupération de toutes les initiales du nom de famille des vips présent dans la bd
module.exports.repertoire = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT DISTINCT SUBSTRING(vip_nom,1,1) AS lettre FROM vip ORDER BY lettre ASC;"; // Requète récupérant la première lettre de chaque nom de vip
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Récupération des vips et certaines de ces infos selon l'initiale de son nom de famille
module.exports.repertoireVip = function(lettre, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT VIP_NOM, VIP_PRENOM, v.VIP_NUMERO, PHOTO_ADRESSE FROM vip v JOIN photo p ON v.VIP_NUMERO=p.VIP_NUMERO WHERE VIP_NOM LIKE "'+lettre+'%" AND PHOTO_NUMERO = 1';
            connexion.query(sql, lettre, callback);
            connexion.release();
        }
    });
}

//Récupération des informations d'un vip selon son numéro
module.exports.repertoireVipInfo = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT VIP_NOM, VIP_PRENOM, DATE_FORMAT(VIP_NAISSANCE,"%W %d %M %Y") AS VIP_NAISSANCE, VIP_TEXTE, NATIONALITE_NOM, PHOTO_ADRESSE FROM vip v, nationalite n, photo p WHERE v.NATIONALITE_NUMERO=n.NATIONALITE_NUMERO AND p.VIP_NUMERO = v.VIP_NUMERO AND PHOTO_NUMERO = 1 AND v.VIP_NUMERO = '+ vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Récupération des liaisons et les informations liés à celles-ci d'un vip choisi
module.exports.repertoireVipLiaison = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT l.VIP_NUMERO, VIP_VIP_NUMERO, DATE_FORMAT(DATE_EVENEMENT, "%M %Y") AS DATE_EVENEMENT, LIAISON_MOTIFFIN, v.VIP_PRENOM, v.VIP_NOM, VIP_TEXTE, PHOTO_ADRESSE FROM liaison l JOIN vip v ON l.VIP_VIP_NUMERO=v.VIP_NUMERO JOIN photo p ON v.VIP_NUMERO=p.VIP_NUMERO WHERE PHOTO_NUMERO = 1 AND l.VIP_NUMERO = '+ vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Récupération des mariages et les informations liés à ceux-ci d'un vip choisi
module.exports.repertoireVipMariage = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT m.VIP_NUMERO, VIP_VIP_NUMERO, DATE_FORMAT(DATE_EVENEMENT, "%M %Y") AS DATE_EVENEMENT, MARIAGE_LIEU, DATE_FORMAT(MARIAGE_FIN, "%M %Y") AS MARIAGE_FIN, MARIAGE_MOTIFFIN, v.VIP_PRENOM, v.VIP_NOM, VIP_TEXTE,PHOTO_ADRESSE FROM mariage m JOIN vip v ON m.VIP_VIP_NUMERO=v.VIP_NUMERO JOIN photo p ON v.VIP_NUMERO=p.VIP_NUMERO WHERE PHOTO_NUMERO = 1 AND m.VIP_NUMERO = '+ vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Récupération des images et ces informations d'un vip
module.exports.repertoireVipImage = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT PHOTO_ADRESSE, PHOTO_COMMENTAIRE, PHOTO_SUJET FROM photo p JOIN vip v ON p.VIP_NUMERO=v.VIP_NUMERO WHERE v.VIP_NUMERO= '+ vip + ' AND PHOTO_NUMERO <> 1'; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Récupération les informations de mannequina d'un vip choisi
module.exports.repertoireVipMannequin = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT DEFILE_LIEU, DATE_FORMAT(DEFILE_DATE, "%M %Y") AS DEFILE_DATE, VIP_NOM, VIP_PRENOM, VIP_TEXTE v.VIP_NUMERO FROM defile d JOIN vip v ON d.VIP_NUMERO=v.VIP_NUMERO WHERE DEFILE_NUMERO IN (SELECT DEFILE_NUMERO FROM defiledans WHERE VIP_NUMERO = '+vip+')'; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Récupération les informations de couturier d'un vip choisi
module.exports.repertoireVipCouturier = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT CASE WHEN VIP_SEXE = "M" THEN "Couturier" ELSE "Couturière" END AS COUTURIER , DEFILE_LIEU, DATE_FORMAT(DEFILE_DATE, "%M %Y") AS DEFILE_DATE FROM vip v JOIN defile d ON v.VIP_NUMERO=d.VIP_NUMERO WHERE v.VIP_NUMERO ='+vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}


//Récupération les informations de chanson d'un vip choisi
module.exports.repertoireVipChanteur = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT CASE WHEN VIP_SEXE = "M" THEN "Chanteur" ELSE "Chanteuse" END AS CHANTEUR,v.VIP_NUMERO, ALBUM_TITRE, DATE_FORMAT(ALBUM_DATE, "%M %Y") AS ALBUM_DATE,MAISONDISQUE_NOM, CHANTEUR_SPECIALITE FROM vip v JOIN chanteur ch ON v.VIP_NUMERO=ch.VIP_NUMERO JOIN composer c ON ch.VIP_NUMERO=c.VIP_NUMERO JOIN album a ON c.ALBUM_NUMERO=a.ALBUM_NUMERO JOIN maisondisque m ON m.MAISONDISQUE_NUMERO=a.MAISONDISQUE_NUMERO WHERE v.VIP_NUMERO='+vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}



//Récupération les informations de réalisation d'un vip choisi
module.exports.repertoireVipRealisateur = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT CASE WHEN VIP_SEXE = "M" THEN "Réalisateur" ELSE "Réalisatrice" END AS REALISATEUR,v.VIP_NUMERO FROM vip v JOIN REALISATEUR r ON v.VIP_NUMERO=r.VIP_NUMERO WHERE v.VIP_NUMERO='+vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}



//Récupération les informations des film réalisé par un vip choisi
module.exports.repertoireVipFilm = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT FILM_TITRE, FILM_DATEREALISATION FROM FILM WHERE VIP_NUMERO ='+vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Récupération les informations des films où a joué un vip choisi
module.exports.repertoireVipJoue = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT FILM_TITRE , FILM_DATEREALISATION, ROLE_NOM, r.VIP_NUMERO, VIP_NOM, VIP_PRENOM, VIP_TEXTE, PHOTO_ADRESSE FROM film f JOIN joue j ON j.FILM_NUMERO=f.FILM_NUMERO JOIN realisateur r ON r.VIP_NUMERO=f.VIP_NUMERO JOIN vip v ON v.VIP_NUMERO=r.VIP_NUMERO JOIN photo p ON p.VIP_NUMERO=v.VIP_NUMERO WHERE j.VIP_NUMERO='+vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}


//Récupération les informations d'acteur/actrice d'un vip choisi
module.exports.repertoireVipActeur = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = 'SELECT  CASE WHEN v.VIP_SEXE = "M" THEN "Acteur" ELSE "Actrice" END AS ACTEUR FROM acteur a JOIN vip v ON a.VIP_NUMERO=v.VIP_NUMERO WHERE a.VIP_NUMERO='+vip; 
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}
