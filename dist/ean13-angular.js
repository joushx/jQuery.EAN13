(function(){
  "use strict";
  angular.module('ean13', [])
    .directive('ean13', function() {
      return {
        restrict: 'E',
        scope: {
          width: '@width',
          height: '@height'
        },
        template: "<canvas width='{{width}}' height='{{height}}'/>",
        link: function($scope, element, attrs) {
          attrs.$observe('code', function(value) {
            new EAN13(element.find("canvas")[0], value);
          });
        }
      };
    });
})();