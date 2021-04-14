let model = require("../models/admin.js");

let async = require('async');

let Cryptr = require('cryptr');

let cryptr = new Cryptr('');
// ////////////////////// L I S T E R     A L B U M S

//Affiche le page de connexion et vérifie celle-ci
module.exports.Connexion = 	function(request, response){
   response.title = 'Administration';
   if(!request.session.login) { //Si le login a été entré
    let login = request.body.login; //Récupération du login entré
    let mdp = request.body.mdp;//Récupération du mot de passe entré
  
        model.connexion(login, mdp, function(err, result) {  // appel le module qui récupère les informations de connextion du login
            if (err) {
                console.log(err);
                return;
            }
            response.connexion = result; // result contient ces inforations
            
            if (result[0] != null) { //Si le login existe dans la bd
                if (cryptr.decrypt(result[0]['PASSWD']) == mdp) { //Si le mot de passe décrypté correspondant au login dans la bd correspond au mot de passe entrée
                    request.session.login = login; //Initialisation de la variable de session login
                    response.redirect('/');//Redirige à la page d'acceuil
                }
                else//Si le mot de passe décrypté ne correspondant pas au login dans la bd correspond au mot de passe entrée
                {
                    response.render('connexion', response);//Affiche le handlebar de la page de connexion
                }
            }
            else {//Si le login n'existe pas dans la bd
                response.render('connexion', response);//Affiche le handlebar de la page de connexion
            }
        })
    }
   else {//Si le formulaire est vide
        response.redirect('/vip');//Redirige à la page d'acceuil
   }
};

//Affiche le page d'ajout d'un vip si la personne est connecté
module.exports.AjoutVip = 	function(request, response){
    response.title = 'Administration';
    if(!request.session.login) {//Si la personne n'est pas connecté
        response.redirect('/');//Redirection vers la page de connexion
    }
    else {//Si la personne est connecté

        //Récupération du nom et prénom entré
        let nom = request.body.nom_vip;
        let prenom = request.body.prenom_vip;
        if (nom && prenom) { //Si ils ont été entré

            //Récupération des données entrées dans le formulaire
            let nationalite = request.body.nat_vip;
            let sexe = request.body.sex_vip;
            let naissance = request.body.date_naiss_vip;
            if (!naissance) {naissance = "NULL"; } else { naissance = "'"+naissance+"'";}
            let texte = request.body.com_vip;
            let photo = request.body.image_vip;
            let sujetPhoto = request.body.sujet_vip;

            model.ajoutVip(nationalite, nom, prenom, sexe, naissance, texte, photo, sujetPhoto, function(err, result) {  // appel le module test qui ajoute le vip
                if (err) {
                    console.log(err);
                    return;
                }
                
                response.msg = nom + " a été ajouté !";//Message de succès

                response.render('ajoutVip', response);//Affichage de la page avec le message
            })
        }
        else {//Si le nom et prénom sont vide
            model.getNationnalite(function(err, result) {  // appel le module test qui récupère les nationnalités
                if (err) {
                    console.log(err);
                    return;
                }
                response.nationalites = result; //contient les nationnaltiés
                
                
                response.render('ajoutVip', response);//affiche le formulaire
            })
        }
    }
 };

 //Affiche le menu pour ajouter ou modifier un vip
module.exports.actionVip = 	function(request, response){
    response.title = 'Administration';
    if(!request.session.login) {//Si la personne n'est pas connecté
        response.redirect('/');//Redirection vers la page de connexion
    }
    else {
        response.render('modifVip', response);//affiche le menu
    }
 };
 
 //Affiche le formulaire de modification d'un vip
 module.exports.ChoixModifVip = function(request, response){
    response.title = 'Administration';
    if(!request.session.login) {//Si la personne n'est pas connecté
        response.redirect('/');//Redirection vers la page de connexion
    }
    else {

        //récupère le numero, le nom et le prénom du vip du formulaire
        let vipId = request.body.vip_id;
        let nom = request.body.nom_vip;
        let prenom = request.body.prenom_vip;
        if (nom && prenom) {//Si nom et prénom non vide
            //Récupération des données du formulaire
            let nationalite = request.body.nat_vip;
            let sexe = request.body.sex_vip;
            let naissance = request.body.date_naiss_vip;
            if (!naissance) {naissance = "NULL"; } else { naissance = "'"+naissance+"'";}
            let texte = request.body.com_vip;
            let photo = request.body.image_vip;
            let sujetPhoto = request.body.sujet_vip;

            
            model.modifVip(vipId, nationalite, nom, prenom, sexe, naissance, texte, photo, sujetPhoto, function(err, result) {  // appel le module test qui modifie le vip
                if (err) {
                    console.log(err);
                    return;
                }
                
                response.msg = nom + " a été modifié !";//message de réussite

                response.render('modifVip', response);//affiche le message
            })
        }
        else {
            let vipId = request.body.vip_choix;//récupère le numéro du vip
            async.parallel ([
                function (callback) {
                model.vips(function (err, result) {callback(null,result)});//récupère tout les vips
                },
                function (callback) {
                model.vip(vipId, (function (errE, resE) {callback(null,resE)}));//récupère les informations du vip que l'on veut modifier
                }, 
                function (callback) {
                model.getNationnalite(function (errE, resE) {callback(null,resE)});//Récupère les nationnalités
                },         
                ],
                function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.vips = result[0]; 
                response.vip = result[1];
                response.nationalites = result[2]; 
                console.log(response.nationalites);
                
                response.render('modifVip', response);//affiche le formulaire
            })
        }
    }
 };


 //Permet la suppression d'un vip
 module.exports.ChoixDeleteVip = function(request, response){
    response.title = 'Administration';
    if(!request.session.login) {
        response.redirect('/');
    }
    else {
        let vipId = request.body.vip_choix;
        if (vipId!=null) {//Si le numéro du vip n'est pas nul
            model.deleteVip(vipId, function(err, result) {//Supprime le vip
                    if (err) {
                        console.log(err);
                        return;
                    }
                })
                response.redirect('/');

        }
        else {
            model.vips(function(err, result) {  // appel le module  qui récupère les vips
                if (err) {
                    console.log(err);
                    return;
                }
                response.vips = result; 
                
                response.render('suppVip', response);//affiche le formulaire pour supprime
            })
        }
    }
 };
 //Affiche le menu pour ajouter ou supprimer une photo
 module.exports.actionPhoto = function(request, response){
    response.title = 'Administration';
    if(!request.session.login) {
        response.redirect('/');
    }
    else {
        response.render('ajoutPhoto', response);
    }
 };

 //Permet l'ajout d'une photo
module.exports.AjoutPhoto = function(request, response){
    response.title = 'Administration';
    if(!request.session.login) {
        response.redirect('/');
    }
    else {
        let idVip = request.body.id_vip;
        if (idVip) {
            let photo = request.body.photo_vip;
            let sujetPhoto = request.body.sujet_photo;
            let comPhoto = request.body.com_photo;

            model.ajoutPhoto(idVip, sujetPhoto, comPhoto, photo, function(err, result) {  // appel le module test qui ajoute la photo
                if (err) {
                    console.log(err);
                    return;
                }
                
                response.msg = "La photo a été ajouté !";//Message réussite

                response.render('ajoutPhoto', response);
            })
        }
        else {
            model.vips(function(err, result) {  // appel le module qui récupère les vips
                if (err) {
                    console.log(err);
                    return;
                }
                response.vips = result; //contient les vips
                
                response.render('ajoutPhoto', response); //Affiche le formulaire
            })
        }
    }
 };

 //Permet la suppression d'une photo
 module.exports.ChoixDeletePhoto = function(request, response){
    response.title = 'Administration';
    if(!request.session.login) {
        response.redirect('/');
    }
    else {
        let vipId = request.body.vip_choix;
        if (vipId) {
            let photoId = request.body.photo_choix;;
            if (photoId) {
                model.deletePhoto(vipId, photoId, function(err, result) {  // appel le module qui supprime la photo
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    response.render('suppPhoto', response);
                })
            }
            else {
                model.photos(vipId, function(err, result) {  // appel le module qui récupère les photos du vip
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.photos = result; 
                    response.idVip = vipId;
                    
                    response.render('suppPhoto', response);//Affiche le formulaire de suppression de la photo
                })
            }
        }
        else {
            model.vips(function(err, result) {  // appel le module qui récupère les vips
                if (err) {
                    console.log(err);
                    return;
                }
                response.vips = result; 
                
                response.render('suppPhoto', response);//Affiche le formulaire de choix du vip auquel on veut supprimer une photo
            })
        }
    }
 };