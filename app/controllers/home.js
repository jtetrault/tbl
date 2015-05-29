'use strict';

var homeModule = angular.module('tbl.home', ['ui.router', 'tbl.jokeService'])
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    });
}])
.controller('HomeCtrl', ['$scope', 'Joke',
  function($scope, Joke) {
    $scope.joke = Joke.randomJoke();
    console.log($scope.joke);
}]);