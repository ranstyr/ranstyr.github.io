myApp.controller('search',
    function ($rootScope, $firebase, $scope, $firebaseAuth, $location ,Authentication, searchService, FIREBASE_URL, $http , $timeout) {
        $rootScope.tracks = $rootScope.tileTracks = [];

        var ref = new Firebase(FIREBASE_URL + 'users/' +
        $rootScope.currentUser.$id + '/recentSearches');

        var recentSearchesInfo = $firebase(ref);
        var recentSearchesObj = recentSearchesInfo.$asArray();

        recentSearchesObj.$loaded().then(function (data) {
            console.log("recentSearches was loaded ");

            var log = [];
            angular.forEach(data, function (value, key) {
                $rootScope.recentSearches[key] = value.$value;
            }, log);

            $rootScope.recentSearches = searchService.uniqueNames($rootScope.recentSearches);

        }); //make sure meetings data is loaded

        //$rootScope.isList = true;

        $scope.$on('$viewContentLoaded', function () {
            //Here your view content is fully loaded !!
            console.log("$viewContentLoaded");
            if ($rootScope.moveSearch == "true") {
                console.log("scope.moveSearch == true");
                $scope.searchSongs($rootScope.search);
            }
        });

        $scope.searchSongs = function (search) {

            var SEARCHTEXT = $scope.search;
            //come from recent search
            if (search) {
                SEARCHTEXT = search;
            }
            // find all sounds of buskers licensed under 'creative commons share alike'
            if (!$.isEmptyObject(SEARCHTEXT)) {
                SC.get('/tracks', {
                        q: SEARCHTEXT,
                        limit: '6',
                        linked_partitioning: '1'
                    },
                    function (data) {
                        //TODO HANDEL DATA IS EMPTY - SCOPE.SEARCH IS MANDATORY + data/length >0
                        //TODO HANDEL DATA IS UNAUTHORIZED
                        if (data && angular.isArray(data.collection) && data.collection.length > 0) {
                            $scope.setNoImage(data);
                            $scope.triggerChangeWithApply(data);
                        } else {
                            //todo [ran] create a line with "no result"
                            ///tracks[key].title
                            $scope.tracks = [{"title": "There are no result , Go to recent Search"}];
                        }

                    })//sc
            }
            ;


        }; //searchsong

        $scope.triggerChangeWithApply = function (data) {

            $scope.$apply(function () {
                console.log(data);

                $rootScope.tracks = $rootScope.tileTracks = data.collection.slice();

                //need to migrate view model based on view flag
                $scope.setView($rootScope.isList);

                console.log("$rootScope.tracks" + $rootScope.tracks);
                searchService.setNext_href(data.next_href);
                searchService.setRecentSearch($scope.search);
                console.log($rootScope.recentSearches);
                $rootScope.lastSearch = $scope.search;
            });


        };

        $scope.nextPagination = function () {

            if ($rootScope.next_href) {

                // Simple GET request example :
                $http.get($rootScope.next_href).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data);
                        $scope.setNoImage(data);
                        $rootScope.tracks = $rootScope.tileTracks = data.collection;

                        //need to migrate view model based on view flag
                        $scope.setView($rootScope.isList);

                        $rootScope.next_href = data.next_href;
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(data);

                    });

            }

                   }; //nextPagination


        $scope.forsong = function (tracks) {
            console.log("forsong");
            for (key in tracks) {
                console.log(tracks[key].title);
            }
        };

        $scope.MoveToImage = function (value) {
            console.log("MoveToImage");
            //add "NoImgae" in case there is no image at SC
            if (value.artwork_url) {
                $scope.imageurl = value.artwork_url;
                $rootScope.imageurl = value.artwork_url;
            } else {
                $scope.imageurl = "../development/images/icons/noimage.jpg";
                $rootScope.imageurl = $scope.imageurl;
            }

            $rootScope.permalink_url = value.permalink_url;
            $scope.currentImage = value;

            //angular.element(document.getElementById("searcRepeater")).append("fadeOut");
            var a = document.getElementById("searcRepeater")

            var b = angular.element(a);

            var c = b.addClass("hidden");

            $timeout(function() {
                $location.path('/image');
            }, 1500);

        };

        $scope.moveToSearch = function (search) {
            console.log("search");
            $rootScope.moveSearch = "true";
            $rootScope.search = search;

            $location.path('/search');
        };

        $scope.setTileView = function () {
            console.log("setTileView");
            $rootScope.isList = '';


            $rootScope.tileTracks = $scope.SetTileTracksArray();
            angular.element(document.getElementById("searchFoot")).removeClass("searchFooter");


        };//setTileView

        $scope.setListView = function () {
            console.log("setListView");
            $rootScope.isList = "true";

            angular.element(document.getElementById("searchFoot")).addClass("searchFooter");

        };//setTileView


        $scope.SetTileTracksArray = function () {
            console.log("SetTileTracksArray");
            if (!$rootScope.tracks) {
                return
            }
            var tracks = $rootScope.tracks.slice();
            var arrays = [], size = 3;

            if (tracks) {
                while (tracks.length > 0)
                    arrays.push(tracks.splice(0, size));
            } else {
                console.log("scope.tracks is empty");
            }

            return arrays;
        };//SetTileTracksArray

        $scope.setView = function (listType) {

            var userId = {};

            if (!$rootScope.currentUser.$id) {
                userId = $rootScope.registerRegUser.uid;
            } else {
                userId = $rootScope.currentUser.$id;
            }

            //[todo] performance - if list type is null we are in registration so we save round trip
            var ref = new Firebase(FIREBASE_URL + 'users/' + userId + '/isList');
            var UserIsListInfo = $firebase(ref);
            //var UserIsListObj = recentSearchesInfo.$asArray();


            $scope.setRepeterView(listType);


            //Todo [ran] from performance POV update "isList" flag should take place at "browser close"/"timeout"/"log Off"
            //$firebaseUtils.updateRec(obj, $rootScope.isList); // updateRec will delete the other keys for us
            var onComplete = function (error) {
                if (error) {
                    console.log('Synchronization failed');
                } else {
                    console.log('Synchronization succeeded');
                }
            };

            UserIsListInfo.$set({isList: $rootScope.isList});
            //firebaseUsers.$set(regUser.uid, userInfo);

        };//setView

        $scope.setNoImage = function (data) {
            var log = [];
            var result = [];
            angular.forEach(data.collection, function (value, key) {
                if (!value.artwork_url) {
                    value.artwork_url = "../development/images/icons/noimage.jpg";
                    result.push(value);
                }
            }, log);

            data = result;
        };

        $scope.setRepeterView = function (listType) {

            if (listType == "true") {
                $scope.setListView();
            } else {
                $scope.setTileView();
            }


        }
    }); //RegistrationController
