'use strict';

var playersModule = angular.module('tbl.players', ['ui.router', 'playerServices']);

playersModule.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('players', {
      url: '/players',
      abstract: true,
      templateUrl: 'views/content.html'
    });
  $stateProvider
    .state('players.list', {  
      url: '',
      templateUrl: 'views/players/player-list.html',
      controller: 'ListPlayersCtrl'
    });
  $stateProvider.state('players.view', {
    url: '/view/:playerId',
    templateUrl: 'views/players/player-detail.html',
    controller: 'DetailPlayerCtrl'
  });
  $stateProvider.state('players.new', {
    url: '/new',
    templateUrl: 'views/players/player-create.html',
    controller: 'CreatePlayerCtrl'
  });
  $stateProvider.state('players.edit', {
    url: '/edit/:playerId',
    templateUrl: 'views/players/player-create.html',
    controller: 'CreatePlayerCtrl'
  });
}]);

playersModule.controller('ListPlayersCtrl', ['Player', '$scope', function (Player, $scope) {
    $scope.players = Player.query();
}]);

playersModule.controller('DetailPlayerCtrl', ['Player', '$scope', '$stateParams',
  function (Player, $scope, $stateParams) {
    $scope.playerId = $stateParams.playerId
    $scope.player = Player.get({playerId: $stateParams.playerId}, function () {
    });

    $scope.updateImage = function (image) {
      $scope.mainImage = image;
    }
}]);

playersModule.controller('CreatePlayerCtrl', ['Player', '$scope', '$stateParams', '$location',
  function (Player, $scope, $stateParams, $location) {
    if ($stateParams.playerId) {
      $scope.player = Player.get({playerId: $stateParams.playerId});
    } else {
      $scope.player = new Player();
    }

    $scope.update = function(player) {
      angular.forEach(player.attributes, function (attribute, index) {
        if (!attribute.key) {
          player.attributes.splice(index, 1);
        }
      });
      var playerId = $stateParams.playerId || null;
      player.$save({playerId: playerId}, function (player, responseHeaders) {
        $location.path('players/view/' + player.link_name);
      });
    };

    $scope.reset = function(player) {
      player.first_name = undefined;
      player.last_name = undefined;
      player.link_name = undefined;
      player.blurb = undefined;
    };

    $scope.onImageUploadSuccess = function(response) {
      console.log(response);
      $scope.player.image = response.data.image;
    };

    $scope.addAttribute = function(player) {
      var a = {key: '', value: ''};
      player.attributes.push(a);
    };

    $scope.removePlayer = function (player){
      var del = confirm('Are you sure you want to delete '+player.full_name()+'?');
      if (del) {
        player.$remove(function (v, r) {
          $location.path('players');
        });
      }
    }
}]);
