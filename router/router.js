let HomeController = require('./../controllers/HomeController');
let VipController = require('./../controllers/VipController');
let AlbumController = require('./../controllers/AlbumController');
let ArticleController = require('./../controllers/ArticleController');

let AdminController = require('./../controllers/AdminController');
let async = require('async');



// Routes
module.exports = function(app) {
    if (app.get('port') == 6800) {
        // Main Routes
        app.get('/', HomeController.Index);
        app.get('/accueil', HomeController.Index);

        // VIP
        //Affichage du choix des vips selon leur lettre
        app.get('/repertoire', VipController.Repertoire);
        //Affichage des vips avec le nom commençant par :lettre
        app.get('/repertoire/:lettre', VipController.RepertoireVip);
        //Affichage des informations du vip numéro :numero
        app.get('/repertoire/vip/:numero', VipController.RepertoireVipInfo);
        
        //  Articles
        //Affichage de la page allant afficher l'article d'un vip choisi
        app.get('/articles', ArticleController.Article);
        //Affichage de l'article du vip numéro :id
        app.get('/articles/:id', ArticleController.ArticleVip);
        
    
        // Albums
        //Affichage de la page allant afficher l'album d'un vip choisi
        app.get('/album', AlbumController.ListerAlbum);
        //Affichage de l'album du vip numéro :id
        app.get('/album/:id', AlbumController.ListerPhotos);
        //Affichage de la photo numéro :nuù du vip numéro :id
        app.get('/album/:id/:num', AlbumController.PhotoSuiv);
    
        // Page 404 lorsque l'utilisateur appel une page non existante
        app.get('*', HomeController.NotFound);
        app.post('*', HomeController.NotFound);
    }
    else {
        if (app.get('port') == 6900) {
            // Main Routes
            app.get('/', AdminController.Connexion);
            app.post('/', AdminController.Connexion);
            
            //Affichage de la page permettant d'ajouter, supprimer ou modifier un vip
            app.get('/vip', AdminController.actionVip);
            app.post('/vip', AdminController.actionVip);

            //Affichage de la page permettant d'ajouter un vip
            app.get('/ajoutVip', AdminController.AjoutVip);
            app.post('/ajoutVip', AdminController.AjoutVip);
            
            //Affichage de la page permettant de modifier un vip
            app.get('/modifVip', AdminController.ChoixModifVip);
            app.post('/modifVip', AdminController.ChoixModifVip);

            //Affichage de la page permettant desupprimer un vip
            app.get('/suppVip', AdminController.ChoixDeleteVip);
            app.post('/suppVip', AdminController.ChoixDeleteVip);

            //Affichage de la page permettant d'ajouter ou supprimer une photo
            app.get('/photo', AdminController.actionPhoto);
            app.post('/photo', AdminController.actionPhoto);

            //Affichage de la page permettant d'ajouter une photo
            app.get('/ajoutPhoto', AdminController.AjoutPhoto);
            app.post('/ajoutPhoto', AdminController.AjoutPhoto);

            //Affichage de la page permettant supprimer une photo
            app.get('/suppPhoto', AdminController.ChoixDeletePhoto);
            app.post('/suppPhoto', AdminController.ChoixDeletePhoto);
        }

    }


};
