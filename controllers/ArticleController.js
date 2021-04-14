let model = require("../models/article.js");

let async = require('async');

//Affiche le menu permettant de choisir un vip pour lire l'article qui lui est associé
module.exports.Article = function(request, response) {
    response.title = 'Article';
    model.vips(function(err, result) {  // appel le module qui récupère tout les vips de la bd
        if (err) {
            console.log(err);
            return;
        }
        response.vips = result; // result contient les vip
       
       response.render('article', response); // appel la vue Handlebars qui va afficher le menu contenant tout les vips
     });
} 

//Affiche le menu permettant de choisir un vip pour lire l'article qui lui est associé ainsi que l'article du vip sélectionné
module.exports.ArticleVip = function(request, response) {
    response.title = 'Article';
 
    let data = request.params.id;//Récupère le numéro du vip auquel on veut lire l'article
   async.parallel ([
       function (callback) {
          model.vips(function (err, result) {callback(null,result)});// appel le module qui récupère tout les vips de la bd
       },
       function (callback) {
          model.articleVip(data, (function (errE, resE) {callback(null,resE)}));// appel le module qui récupère l'article du vip numéro data
       },     
   ],
   function (err, result) {
    if (err) {
       console.log(err);
       return;
    }
    response.vips = result[0];//result contient les vips
    response.article = result[1];//result contient l'article du vip
    response.render('article', response); // appel la vue Handlebars qui va afficher le menu contenant tout les vips ainsi que l'article souhaité
   }
   )  
 };