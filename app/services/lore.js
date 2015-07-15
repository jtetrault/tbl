'use strict';

angular.module('tbl.services.lore', ['ngResource'])
.factory('Lore', ['$resource', function($resource){
  var options = {
    addImage: {
      method: 'POST',
      url: '/lore/:link_name/images'
    },
    deleteImage: {
      method: 'DELETE',
      params: {link_name: '@link_name'},
      url: '/lore/:link_name/images/:imageId'
    }
  };
  var Lore = $resource('/lore/:link_name', {link_name: '@link_name'}, options);
 Lore.prototype.first_image = function() {
   if (this.images.length > 0) {
     return this.images[0];
   }
   return null;
 };

 return Lore;
}]);
