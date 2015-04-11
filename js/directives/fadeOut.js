myApp.directive('fadeOut', function($route) {
  return {
    restrict: 'A',
    link: function ($scope, $element, attrs) {
      $element.addClass("ng-hide-add");
      $element.on('load', function () {
        $element.addClass("ng-hide-remove");
      });
    }
  }
});