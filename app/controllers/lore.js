(function () {
  'use strict';

  angular.module('tbl.controllers.lore', ['ui.router', 'tbl.services.lore'])

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('lore', {
        url: '/lore',
        abstract: true,
        templateUrl: 'views/content.html'
      });
    $stateProvider
      .state('lore.list', {  
        url: '',
        templateUrl: 'views/lore/list.html',
        controller: 'ListLoreCtrl'
      });
    $stateProvider.state('lore.view', {
      url: '/view/:link_name',
      templateUrl: 'views/lore/view.html',
      controller: 'DetailLoreCtrl'
    });
    $stateProvider.state('lore.new', {
      url: '/new',
      templateUrl: 'views/lore/create.html',
      controller: 'CreateLoreCtrl'
    });
    $stateProvider.state('lore.edit', {
      url: '/edit/:link_name',
      templateUrl: 'views/lore/create.html',
      controller: 'CreateLoreCtrl'
    });
  }])

 .controller('ListLoreCtrl', ['Lore', '$scope', function (Lore, $scope) {
      $scope.lores = Lore.query();
  }])

  .controller('DetailLoreCtrl', ['Lore', '$scope', '$stateParams',
    function (Lore, $scope, $stateParams) {
      $scope.link_name = $stateParams.link_name;
      $scope.lore = Lore.get({link_name: $scope.link_name}, function () {
      });

      $scope.updateImage = function (image) {
        $scope.mainImage = image;
      }
  }])

  .controller('CreateLoreCtrl', ['Lore', '$scope', '$stateParams', '$state',
    function (Lore, $scope, $stateParams, $state) {
      if ($stateParams.link_name) {
        $scope.lore = Lore.get({link_name: $stateParams.link_name});
      } else {
        $scope.lore = new Lore();
      }

      $scope.update = function(lore) {
        var link_name = $stateParams.link_name || null;
        lore.$save({link_name: link_name}, function (lore, responseHeaders) {
          $state.go('lore.view', ({link_name: lore.link_name}));
        });
      };

      $scope.reset = function(player) {
        lore.title = undefined;
        lore.link_name = undefined;
        lore.text = undefined;
      };
/*
      $scope.onImageUploadSuccess = function(response) {
        $scope.player.image = response.data.image;
      };
*/

      $scope.removeLore = function (lore){
        var del = confirm('Are you sure you want to delete '+lore.title+'?');
        if (del) {
          lore.$remove(function (v, r) {
            $location.path('lore');
          });
        }
      }
  }]);
})();
