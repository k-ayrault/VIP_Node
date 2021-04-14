

  // ////////////////////////////////////////////// A C C U E I L
  //Affiche la page d'acceuil
module.exports.Index = function(request, response){
    response.title = "Bienvenue sur le site de SIXVOIX (IUT du Limousin).";
    response.render('home', response);
};

//Affiche la page 404
module.exports.NotFound = function(request, response){
    response.title = "Bienvenue sur le site de SIXVOIX (IUT du Limousin).";
    response.render('notFound', response);
};
