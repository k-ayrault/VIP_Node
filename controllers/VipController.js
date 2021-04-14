let model = require("../models/vip.js");

let async = require('async');

/////////////////////////// R E P E R T O I R E    D E S     S T A R S

//Module permettant d'afficher le menu de choix des vips selon l'initiale de leur nom
module.exports.Repertoire = 	function(request, response){
   response.title = 'Répertoire des stars';
   
   model.repertoire(function(err, result) {  // appel le module  qui exécute la requete récupérant toutes les initailes des noms des vips dans la bd
      if (err) {
          console.log(err);
          return;
      }
      response.lettres = result; // result contient les premières lettres des noms des vip
     
     response.render('repertoireVips', response); // appel la vue Handlebars qui va afficher le menu permettant de chosir une lettre
   });  
    
};

//Affiche le menu initiale ainsi que les vips ayant leur nom commencant par la lettre choisi
module.exports.RepertoireVip = 	function(request, response) {
   response.title = 'Répertoire des stars';

   let data = request.params.lettre; //Récupération de l'initiale des vips à afficher
  async.parallel ([
      function (callback) {
         model.repertoire(function (err, result) {callback(null,result)});// appel le module  qui exécute la requete récupérant toutes les initailes des noms des vips dans la bd
      },
      function (callback) {
         model.repertoireVip(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant tous les vips ayant comme initiale pour leur nom data
      },     
  ],
  function (err, result) {
   if (err) {
      console.log(err);
      return;
   }
   response.lettres = result[0]; //result contient les premières lettres des noms des vip
   response.vips = result[1]; // result contenant les vips ayant comme première lettre de leur nom data
   response.render('repertoireVips', response);// appel la vue Handlebars qui va afficher le menu permettant de chosir une lettre ainsi que les vips ayant comme initiale data
  }
  )  
};

//Affiche les informations d'un vip choisi
module.exports.RepertoireVipInfo = 	function(request, response) {
   response.title = 'Répertoire des stars';

   let data = request.params.numero;
  async.parallel ([
      function (callback) {
         model.repertoire(function (err, result) {callback(null,result)});// appel le module  qui exécute la requete récupérant toutes les initailes des noms des vips dans la bd
      },
      function (callback) {
         model.repertoireVipInfo(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant toutes les informations du vip numéro data
      },    
      function (callback) {
         model.repertoireVipLiaison(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant toutes les liaisons du vip numéro data
      }, 
      function (callback) {
         model.repertoireVipMariage(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant tout les matiages du vip numéro data
      },
      function (callback) {
         model.repertoireVipImage(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant toutes les images du vip numéro data
      },
      function (callback) {
         model.repertoireVipMannequin(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant les informations du vip numéro data si celui ci est mannequin
      },
      function (callback) {
         model.repertoireVipCouturier(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant les informations du vip numéro data si celui ci est couturier
      },
      function (callback) {
         model.repertoireVipChanteur(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant les informations du vip numéro data si celui ci est chanteur
      },
      function (callback) {
         model.repertoireVipRealisateur(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant les informations du vip numéro data si celui ci est réalisateur
      },
      function (callback) {
         model.repertoireVipFilm(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant les informations des film du vip numéro data si celui ci est réalisateur
      },
      function (callback) {
         model.repertoireVipActeur(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant les informations du vip numéro data si celui ci est acteur
      },
      function (callback) {
         model.repertoireVipJoue(data, (function (errE, resE) {callback(null,resE)}));// appel le module  qui exécute la requete récupérant les films où vip numéro data a joué dedans
      },
  ],
   function (err, result) {
      if (err) {
         console.log(err);
         return;
      }

      response.lettres = result[0];//result contient les premières lettres des noms des vip
      response.info = result[1];//result contient les infos du vip numéro data
      response.liaison = result[2];//result contient les laisons du vip numéro data
      response.mariage = result[3];//result contient les mariages du vip numéro data
      response.image = result[4];//result contient les images du vip numéro data
      response.mannequin = result[5];//result contient les infos du vip numéro data si celui-ci est mannequin
      response.couturier = result[6];//result contient les infos du vip numéro data si celui-ci est couturier
      response.chanteur = result[7];//result contient les infos du vip numéro data si celui-ci est chanteur
      response.realisateur = result[8];//result contient les infos du vip numéro data si celui-ci est réalisateur
      response.film = result[9];//result contient les films réalisé par le vip numéro data
      response.acteur = result[10];//result contient les infos du vip numéro data si celui-ci est acteur
      response.jouer = result[11];//result contient les films où a joué le vip numéro data

      response.render('repertoireVips', response);// appel la vue Handlebars qui va afficher les infos du vip numéro data ainsi que le menu permettant de chosir une lettre 
   }
  )  
};