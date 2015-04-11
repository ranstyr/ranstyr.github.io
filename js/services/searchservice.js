myApp.factory('searchService', function ($firebase,$rootScope, FIREBASE_URL, Authentication ) {


    if (!$rootScope.currentUser.$id) {
        var ref = new Firebase(FIREBASE_URL + '/users/' +
        $rootScope.registerRegUser.uid + '/recentSearches');
    } else {
        var ref = new Firebase(FIREBASE_URL + '/users/' +
        $rootScope.currentUser.$id + '/recentSearches');
    }


    var recentSearchesInfo = $firebase(ref);
    var recentSearchesObj = recentSearchesInfo.$asArray();

    $rootScope.next_href = null;
    $rootScope.tracks = null;

    var myObject;
    myObject = {

        setNext_href: function (Next_href) {
            $rootScope.next_href = Next_href;
        }, //login

        uniqueNames: function (names) {
            var uniqueNames = [];
            var log = [];
            angular.forEach(names, function (el, i) {
                if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
            }, log);
            return uniqueNames;
        }, //uniqueNames


        setRecentSearch: function (searchString) {

            if ($.inArray(searchString, $rootScope.recentSearches) != -1) {
                return myObject
            }
            //ToDo [] set constant
            if ($rootScope.recentSearches.length < 5) {
                $rootScope.recentSearches.unshift(searchString);
            } else {
                $rootScope.recentSearches.pop();
                $rootScope.recentSearches.unshift(searchString);
            }//else


            var recentSearchesInfo = $firebase(ref);
            recentSearchesInfo.$set($rootScope.recentSearches).then(function () {
                console.log("recentSearches was saved ");
            });

        }
    };
    return myObject;

}); //CountMeetings