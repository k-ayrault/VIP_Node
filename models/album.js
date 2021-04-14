let db = require('../configDb');

//Récupération de toutes les photos principales des vips présents dans la bd
module.exports.photoVips = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT PHOTO_ADRESSE, p.VIP_NUMERO FROM photo p JOIN vip v ON p.VIP_NUMERO=v.VIP_NUMERO WHERE PHOTO_NUMERO = 1 ORDER BY VIP_NOM ASC";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

//Récupération de la photo principale d'un vip choisi
module.exports.photoVip = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT PHOTO_ADRESSE, PHOTO_COMMENTAIRE, p.VIP_NUMERO, VIP_NOM, VIP_PRENOM FROM photo p JOIN vip v ON p.VIP_NUMERO=v.VIP_NUMERO WHERE PHOTO_NUMERO = 1 AND v.VIP_NUMERO = " + vip + " ORDER BY VIP_NOM ASC";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};


//Récupération de la photo suivante de celle choisi
module.exports.photoVipSuiv = function(vip, num, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT VIP_NUMERO, PHOTO_NUMERO FROM photo WHERE VIP_NUMERO = " + vip +"  AND PHOTO_NUMERO > " + num + " ORDER BY PHOTO_NUMERO ASC LIMIT 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

//Récupération de la photo précédente de celle choisi
module.exports.photoVipPrec = function(vip, num, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT VIP_NUMERO, PHOTO_NUMERO FROM photo WHERE VIP_NUMERO = " + vip +"  AND PHOTO_NUMERO < " + num + " ORDER BY PHOTO_NUMERO DESC LIMIT 1";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};


//Récupération d'une photo selon son numéro
module.exports.photoVipNum = function(vip, num, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT PHOTO_ADRESSE, PHOTO_COMMENTAIRE, p.VIP_NUMERO, VIP_NOM, VIP_PRENOM FROM photo p JOIN vip v ON p.VIP_NUMERO=v.VIP_NUMERO WHERE PHOTO_NUMERO = " + num +  " AND v.VIP_NUMERO = " + vip + " ORDER BY VIP_NOM ASC";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};