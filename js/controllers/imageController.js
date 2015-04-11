myApp.controller('imageController',
    function($rootScope ,$firebase, $scope, $firebaseAuth, $location, Authentication, searchService , FIREBASE_URL , $sce) {

        var ref = new Firebase(FIREBASE_URL + '/users/' +
        $rootScope.currentUser.$id + '/recentSearches');

        var recentSearchesInfo = $firebase(ref);
        var recentSearchesObj = recentSearchesInfo.$asObject();

        $scope.imageurl =  $rootScope.imageurl;
        $scope.permalink_url =   $rootScope.permalink_url;


        $scope.play = function() {

            console.log($scope.permalink_url);
            SC.oEmbed($scope.permalink_url, { auto_play: true }, function(oEmbed) {
                if (!oEmbed){alert("Sorry, Sound track is not available. Please search for a new song")};
                $scope.$apply($scope.iFrame = $sce.trustAsHtml(oEmbed.html));
            });
        }

    }); //RegistrationController
