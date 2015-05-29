'use strict';

var usersModule = angular.module('myApp.users', ['ngRoute', 'userServices']);

playersModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/players', {
    templateUrl: 'players/player-list.html',
    controller: 'ListPlayersCtrl'
  });
  $routeProvider.when('/players/view/:playerId', {
    templateUrl: 'players/player-detail.html',
    controller: 'DetailPlayerCtrl'
  });
  $routeProvider.when('/players/new', {
    templateUrl: 'players/player-create.html',
    controller: 'CreatePlayerCtrl'
  });
  $routeProvider.when('/players/edit/:playerId', {
    templateUrl: 'players/player-create.html',
    controller: 'CreatePlayerCtrl'
  });
}]);