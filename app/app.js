'use strict';

// Declare app level module which depends on views, and components
angular.module('tbl', [
  'ui.router',
  'lr.upload',
  'tbl.home',
  'tbl.players',
  'tbl.admin',
  'tbl.authService',
  'tbl.services.lore',
  'tbl.controllers.lore'
]).
config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider',
  function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise('/');
  }
]).
controller('CheckLoginCtrl', ['Auth', function(Auth) {
  Auth.checkAuthenticated();
}]);
