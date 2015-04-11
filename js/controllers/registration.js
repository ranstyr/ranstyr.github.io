myApp.controller('RegistrationController', 
  function($scope, $firebaseAuth, $location, Authentication , $rootScope , FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  var auth = $firebaseAuth(ref);
  
  $scope.login = function() {
    //SC init
    Authentication.soundcloudinit();
    Authentication.login($scope.user)
    .then(function(user) {
      $location.path('/search');
    }).catch(function(error) {
      $scope.message = error.message;
    });


  }; //login

  $scope.register = function() {
    //SC init
    Authentication.soundcloudinit();
    $rootScope.isList = 'true';
    Authentication.register($scope.user)
      .then(function(user) {
        Authentication.login($scope.user);

        $location.path('/search');
      }).catch(function(error) {
        $scope.message = error.message;
      });
  }; //register

}); //RegistrationController