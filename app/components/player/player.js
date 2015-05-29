'use strict';

/* Services */

var playerServices = angular.module('playerServices', ['ngResource']);

playerServices.factory('Player', ['$resource',
  function($resource){
    var Player = $resource('/players/:playerId', {playerId: '@link_name'}, {});
    Player.prototype.full_name = function() {return this.first_name + ' ' + this.last_name;};
    return Player;
  }]);