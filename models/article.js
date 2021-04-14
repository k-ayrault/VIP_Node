let db = require('../configDb');

//Récupération de tous les vips avec leur nom et prénom
module.exports.vips = function(callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT VIP_NUMERO,VIP_NOM, VIP_PRENOM FROM vip ORDER BY VIP_NOM ASC ;";
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};

//Récupération de l'article et ces informations selon un vip choisi
module.exports.articleVip = function(vip, callback) {
    db.getConnection(function(err, connexion) {
        if (!err) {
            let sql = "SELECT v.VIP_NUMERO,VIP_NOM, VIP_PRENOM, ARTICLE_RESUME, ARTICLE_DATE_INSERT FROM vip v JOIN apoursujet aps ON v.VIP_NUMERO=aps.VIP_NUMERO JOIN article a ON aps.ARTICLE_NUMERO=a.ARTICLE_NUMERO WHERE v.VIP_NUMERO = " + vip;
            connexion.query(sql, callback);
            connexion.release();
        }
    });
};