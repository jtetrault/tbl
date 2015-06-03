'use strict';

angular.module('tbl.services.lore', ['ngResource'])
.factory('Lore', ['$resource', function($resource){
  var Lore = $resource('/lore/:link_name', {link_name: '@link_name'}, {});
  return Lore;
}]);
