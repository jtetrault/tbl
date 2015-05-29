'use strict';

angular.module('tbl.authService', [])
.factory('Auth', ['$http', '$rootScope', function ($http, $rootScope) {
  var Auth = {};
  var authenticated = false;

  Auth.updateAuthenticated = function(result) {
    authenticated = result;
    $rootScope.authenticated = authenticated;
  };

  Auth.checkAuthenticated = function (success, error) {
    $http.get('/authenticated').
      success (function (data, status, headers, config) {
        Auth.updateAuthenticated(true);
        if (success) {
          success(data, status, headers, config);
        }
      }).
      error(function (data, status, headers, config) {
        Auth.updateAuthenticated(false);
        if (error) {
          error(data, status, headers, config);
        }
      });
  };

  Auth.login = function (username, password, success, error) {
    $http.post('/login', {username: username, password: password}).
      success(function (data, status, headers, config) {
        Auth.updateAuthenticated(true);
        if (success) {
          success(data, status, headers, config);
        }
      }).
      error(function (data, status, headers, config) {
        Auth.updateAuthenticated(false);
        if (error) {
          error(data, status, headers, config);
        }
      });
  };

  return Auth;
}]);