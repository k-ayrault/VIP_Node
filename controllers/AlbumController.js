let model = require("../models/album.js");

let async = require('async');

// ////////////////////// L I S T E R     A L B U M S
 // Affiche le menu permettant de choisir un vip pour voir son album
module.exports.ListerAlbum = 	function(request, response){
   response.title = 'Album des stars';
   model.photoVips(function(err, result) {  // appel le module test qui récupère toutes les photos principales des vips présents dans la bd
      if (err) {
          console.log(err);
          return;
      }
      response.photo = result; // result contient les photos principakes des vips
     
     response.render('listerAlbum', response); // appel la vue Handlebars qui va afficher le menu
  });
};

 // Affiche le menu permettant de choisir un vip pour voir son album ainsi que la première photo du vip
module.exports.ListerPhotos = 	function(request, response){
  response.title = 'Album des stars';
  
  let data = request.params.id;//Récupère le numéro du vip

  async.parallel ([
    function (callback) {
       model.photoVips(function (err, result) {callback(null,result)});//Récupère toutes les photos ptincipales des vips
    },
    function (callback) {
       model.photoVip(data, (function (errE, resE) {callback(null,resE)}));//Récupère la photo principale du vip 
    },
    function (callback) {
      model.photoVipSuiv(data, 1, (function (errE, resE) {callback(null,resE)}));//Récupère la photo suivante si celle-ci existe
    },        
    ],
    function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    response.photo = result[0];//contient les photos principales des vips
    response.photosVip = result[1];//contient la photo principale du vip
    response.photosVipSuiv = result[2];//contient la photo suivante du vip

    response.render('listerAlbum', response);// appel la vue Handlebars qui va afficher le menu ainsi que la photo
  })  
};

 // Affiche le menu permettant de choisir un vip pour voir son album ainsi que la photo à afficher
module.exports.PhotoSuiv = 	function(request, response){
  response.title = 'Album des stars';
  
  let data = request.params.id; //Récupère le numéro du vip
  let dataNum = request.params.num; //Récupère le numéro de la photo 

  async.parallel ([
    function (callback) {
       model.photoVips(function (err, result) {callback(null,result)});//Récupère toutes les photos ptincipales des vips
    }, 
    function (callback) {
       model.photoVipNum(data, dataNum, (function (errE, resE) {callback(null,resE)}));//Récupère la photo du vip 
    },
    function (callback) {
      model.photoVipSuiv(data, dataNum, (function (errE, resE) {callback(null,resE)}));//Récupère la photo suivante si celle-ci existe
    }, 
    function (callback) {
      model.photoVipPrec(data, dataNum, (function (errE, resE) {callback(null,resE)}));//Récupère la photo précédente si celle-ci existe
    },           
    ],
    function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    response.photo = result[0];//contient les photos principales des vips
    response.photosVip = result[1];//contient la photo principale du vip
    response.photosVipSuiv = result[2];//contient la photo suivante du vip
    response.photosVipPrec = result[3];//contient la photo précédente du vip

    response.render('listerAlbum', response);// appel la vue Handlebars qui va afficher le menu ainsi que la photo
  })  
};