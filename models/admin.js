let db = require('../configDb');


//Récupération des informations de connexion selon le login
module.exports.connexion = function(login, mdp, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT LOGIN, PASSWD FROM parametres WHERE LOGIN = \"" + login + "\"";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

//Récupération des nationnalités présentes dans la bd
module.exports.getNationnalite = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT NATIONALITE_NUMERO, NATIONALITE_NOM FROM nationalite";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

//Récupération du numéro, nom et prénom de tous les vips
module.exports.vips = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT VIP_NUMERO,VIP_NOM, VIP_PRENOM FROM vip ORDER BY VIP_NOM ASC ;";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

//Récupération des informations d'un vip choisi 
module.exports.vip = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT v.VIP_NUMERO, VIP_NOM, VIP_PRENOM, VIP_SEXE, VIP_NAISSANCE, VIP_TEXTE, PHOTO_SUJET, PHOTO_ADRESSE FROM vip v JOIN photo p ON v.VIP_NUMERO=p.VIP_NUMERO WHERE PHOTO_NUMERO = 1 AND v.VIP_NUMERO = " +  vip + " ORDER BY VIP_NOM ASC ;";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};


//Insert dans la bd un nouveau vip avec sa photo principale
module.exports.ajoutVip = function(nationalite, nom, prenom, sexe, naissance, texte, photo, sujet, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "INSERT INTO vip (NATIONALITE_NUMERO, VIP_NOM, VIP_PRENOM, VIP_SEXE, VIP_NAISSANCE, VIP_TEXTE, VIP_DATE_INSERTION)VALUES ( \"" + nationalite + "\", \"" + nom + "\", \"" + prenom + "\", \"" + sexe + "\", " + naissance + ", \"" + texte + "\", NOW());";
            connexion.query(sql, callback);
            connexion.release();
            db.getConnection(function(err, connexion) {
                if (!err) {
                    sql = "INSERT INTO photo (PHOTO_NUMERO, VIP_NUMERO, PHOTO_SUJET, PHOTO_COMMENTAIRE, PHOTO_ADRESSE) VALUES (1,(SELECT VIP_NUMERO FROM vip ORDER BY VIP_NUMERO DESC LIMIT 1), \""+ sujet + "\",\"\", \"" + photo + "\")";
                    connexion.query(sql, callback);
                    connexion.release();
                }
            });
        };
    });
}

//Modifie un vip ainsi que photo principale
module.exports.modifVip = function(vipId, nationalite, nom, prenom, sexe, naissance, texte, photo, sujet, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "UPDATE vip SET NATIONALITE_NUMERO = \"" + nationalite + "\", VIP_NOM = \"" + nom + "\", VIP_PRENOM = \"" + prenom + "\", VIP_SEXE = \"" + sexe + "\", VIP_NAISSANCE = " + naissance + ", VIP_TEXTE = \"" + texte + "\" WHERE VIP_NUMERO = " + vipId + ";";
            connexion.query(sql, callback);
            connexion.release();
            db.getConnection(function(err, connexion) {
                if (!err) {
                    if (photo) {
                        sql = "UPDATE photo SET PHOTO_SUJET = \"" + sujet +"\", PHOTO_ADRESSE = \"" + photo + "\" WHERE VIP_NUMERO = " + vipId;
                    }
                    else
                    {
                        sql = "UPDATE photo SET PHOTO_SUJET = \"" + sujet +"\" WHERE VIP_NUMERO = " + vipId;
                    }
                    connexion.query(sql, callback);
                    connexion.release();
                }
            });
        };
    });
}

//Insert une photo dans la bd à un vip choisi
module.exports.ajoutPhoto = function(idVip, sujet, commenaire, photo, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "INSERT INTO photo (PHOTO_NUMERO, VIP_NUMERO, PHOTO_SUJET, PHOTO_COMMENTAIRE, PHOTO_ADRESSE)VALUES ((SELECT PHOTO_NUMERO + 1 FROM (SELECT * FROM photo) t1 WHERE VIP_NUMERO = "+ idVip + " ORDER BY PHOTO_NUMERO DESC LIMIT 1)," + idVip + ", \""+ sujet + "\",\""+ commenaire +"\", \"" + photo + "\")";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Récupère toutes les photos d'un vip sauf sa principale
module.exports.photos = function(idVip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT VIP_NUMERO, PHOTO_NUMERO, PHOTO_SUJET FROM photo WHERE VIP_NUMERO = " + idVip + " AND PHOTO_NUMERO <> 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Supprime une photo de la bd
module.exports.deletePhoto = function(idVip, idPhoto, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM photo WHERE VIP_NUMERO = " + idVip + " AND PHOTO_NUMERO = " + idPhoto;
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}

//Supprime un vip de la bd ainsi que toutes ces informations associés
module.exports.deleteVip = function(idVip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM joue WHERE FILM_NUMERO = (SELECT FILM_NUMERO FROM film WHERE VIP_NUMERO = " + idVip + " )";
            connexion.query(sql, callback);
            connexion.release();
            db.getConnection(function(err, connexion) {
                if (!err) {
                    let sql = "DELETE FROM film WHERE VIP_NUMERO = " + idVip;
                    connexion.query(sql, callback);
                    connexion.release();

                    db.getConnection(function(err, connexion) {
                        if (!err) {
                            let sql = "DELETE FROM realisateur WHERE VIP_NUMERO = " + idVip;
                            connexion.query(sql, callback);
                            connexion.release();
                        }
                    });
                }
            });
        }
    });

    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM joue WHERE VIP_NUMERO = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
            db.getConnection(function(err, connexion) {
                if (!err) {
                    let sql = "DELETE FROM acteur WHERE VIP_NUMERO = " + idVip;
                    connexion.query(sql, callback);
                    connexion.release();
                }
            });
        }
    });

    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM photo WHERE VIP_NUMERO = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
        }
    });

    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM liaison WHERE VIP_NUMERO = " + idVip + " OR VIP_VIP_NUMERO = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
        }
    });

    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM mariage WHERE VIP_NUMERO = " + idVip + " OR VIP_VIP_NUMERO = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
        }
    });

    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM album WHERE ALBUM_NUMERO = (SELECT ALBUM_NUMERO FROM composer WHERE VIP_NUMERO = " + idVip + " )";
            connexion.query(sql, callback);
            connexion.release();
            db.getConnection(function(err, connexion) {
                if (!err) {
                    let sql = "DELETE FROM composer WHERE VIP_NUMERO = " + idVip;
                    connexion.query(sql, callback);
                    connexion.release();

                    db.getConnection(function(err, connexion) {
                        if (!err) {
                            let sql = "DELETE FROM chanteur WHERE VIP_NUMERO = " + idVip;
                            connexion.query(sql, callback);
                            connexion.release();
                        }
                    });
                }
            });
        }
    });

    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM apoursujet WHERE VIP_NUMERO = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
            db.getConnection(function(err, connexion) {
                if (!err) {
                    let sql = "DELETE FROM article WHERE ARTICLE_NUMERO = (SELECT ARTICLE_NUMERO FROM apoursujet WHERE VIP_NUMERO = " + idVip + " )";
                    connexion.query(sql, callback);
                    connexion.release();

                    db.getConnection(function(err, connexion) {
                        if (!err) {
                            let sql = "DELETE FROM exemplaire WHERE EXEMPLAIRE_NUMERO = (SELECT EXEMPLAIRE_NUMERO FROM article WHERE ARTICLE_NUMERO = (SELECT ARTICLE_NUMERO FROM apoursujet WHERE VIP_NUMERO = " + idVip + " ))";
                            connexion.query(sql, callback);
                            connexion.release();
                        }
                    });
                }
            });
        }
    });
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM defiledans WHERE VIP_NUMERO = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
            db.getConnection(function(err, connexion) {
                if (!err) {
                    let sql = "DELETE FROM apouragence WHERE VIP_NUMERO = " + idVip;
                    connexion.query(sql, callback);
                    connexion.release();

                    db.getConnection(function(err, connexion) {
                        if (!err) {
                            let sql = "DELETE FROM mannequin WHERE VIP_NUMERO = " + idVip;
                            connexion.query(sql, callback);
                            connexion.release();
                        }
                    });
                }
            });
        }
    });
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM defiledans WHERE DEFILE_NUMERO = (SELECT DEFILE_NUMERO FROM defile WHERE VIP_NUMERO = " + idVip + ")";
            connexion.query(sql, callback);
            connexion.release();
            db.getConnection(function(err, connexion) {
                if (!err) {
                    let sql = "DELETE FROM defile WHERE VIP_NUMERO = " + idVip;
                    connexion.query(sql, callback);
                    connexion.release();

                    db.getConnection(function(err, connexion) {
                        if (!err) {
                            let sql = "DELETE FROM couturier WHERE VIP_NUMERO = " + idVip;
                            connexion.query(sql, callback);
                            connexion.release();
                        }
                    });
                }
            });
        }
    });
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "DELETE FROM vip WHERE VIP_NUMERO = " + idVip;
            connexion.query(sql, callback);
            connexion.release();
        }
    });
}
