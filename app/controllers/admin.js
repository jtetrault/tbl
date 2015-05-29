'use strict';

var adminModule = angular.module('tbl.admin', ['ui.router', 'tbl.authService']);

adminModule.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        abstract: true,
        templateUrl: 'views/content.html',
      })
      .state('admin.login', {
        url: '/login',
        templateUrl: 'views/admin/login.html',
        controller: 'AdminLoginCtrl'
      });
  }
]);

adminModule.controller('AdminLoginCtrl', ['$scope', 'Auth', '$state',
  function($scope, Auth, $state) {
    $scope.username = '';
    $scope.password = '';
    $scope.error = null;

    $scope.submit = function() {
      Auth.login($scope.username, $scope.password,
        function (data, status, headers, config) {
          $scope.error = null;
          $state.go('home');
        },
        function (data, status, headers, config) {
          $scope.error = data.message;
        });
    };
}]);