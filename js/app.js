var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate' ,
    'firebase', 'appControllers'])
    .constant('FIREBASE_URL', 'https://SCAngularJS.firebaseio.com/');

var appControllers = angular.module('appControllers',
    ['firebase']);

myApp.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError',
        function (event, next, previous, error) {
            if (error === 'AUTH_REQUIRED') {
                $rootScope.message = 'Sorry, you must log in to access that page';
                $location.path('/login');
            }
        });
}]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'RegistrationController'
        }).
        when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegistrationController'
        }).
        when('/search', {
            templateUrl: 'views/search.html',
            controller: 'search'
        }).
        when('/image', {
            templateUrl: 'views/image.html',
            controller: 'imageController'
            //animation: 'reveal-animation'
        }).
        when('/recentsearch', {
            templateUrl: 'views/recentsearch.html',
            controller: 'search'
            }
        ).
        otherwise({
            redirectTo: '/login'
        });
}]);