'use strict';

angular.module('tbl.jokeService', [])
.factory('Joke', [function () {

  function randomFromList(list) {
    var index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  var JokeGenerator = {
    jokeList: [
      "Where absolute trash happens.",
      "If you're looking for the place where legends are born, look somewhere else.",
      "I need to go home.",
      "SpyCopter!",
      "I don't give a flying filler's fuck!",
      "Watch out for the vomit hole!",
      "D-League for South West Transcona Division",
      'Where "Full Court" is a dirty word.',
      "Cancelled again due to lack of participation",
      "Oxford?"
    ]
  }

  JokeGenerator.randomJoke = function () {
    return randomFromList(this.jokeList);
  }.bind(JokeGenerator);
  
  return JokeGenerator;
}]);