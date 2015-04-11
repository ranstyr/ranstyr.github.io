myApp.factory('Authentication', function ($firebase,
                                          $firebaseAuth, $rootScope, $routeParams, $location, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    auth.$onAuth(function (authUser) {
        if (authUser) {
            var ref = new Firebase(FIREBASE_URL + '/users/' + authUser.uid);
            var user = $firebase(ref).$asObject();
            $rootScope.currentUser = user;
        } else {
            $rootScope.currentUser = '';
        }
    });

    //Temporary object
    var myObject = {



        login: function (user) {
            //init
            $rootScope.tileTracks = null;
            $rootScope.tracks = null;
            $rootScope.recentSearches = [];
            $rootScope.moveSearch = null;
            $rootScope.search = null;

            return auth.$authWithPassword({
                email: user.email,
                password: user.password
            }).then(function (regUser) {

;

                var ref = new Firebase(FIREBASE_URL + 'users/' + regUser.uid + '/isList');
                var UserIsListInfo = $firebase(ref);
                var UserIsListInfo = UserIsListInfo.$asArray();

                    UserIsListInfo.$loaded().then(function (data) {
                        console.log("UserIsListInfo was loaded ");
                        $rootScope.isList = data[0].$value;
                    });//$loaded
                });//authWithPassword
        }, //login

        logout: function (user) {

            return auth.$unauth();
        }

        , //login

        soundcloudinit: function () {
            //ToDo check if SC throws error
            return SC.initialize({
                client_id: 'd652006c469530a4a7d6184b18e16c81',
                redirect_uri: 'http://example.com/callback.html'
            }); //initialize
        }
        , //login

        register: function (user) {
            return auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (regUser) {
                var ref = new Firebase(FIREBASE_URL + 'users');
                var firebaseUsers = $firebase(ref);

                //regUser.uid - for running searchservice while registration
                //todo [ran] searchservice should be part of search controller
                $rootScope.registerRegUser = regUser;

                var userInfo = {
                    date: Firebase.ServerValue.TIMESTAMP,
                    regUser: regUser.uid,
                    isList: {'isList': $rootScope.isList},
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                }; //user info


                firebaseUsers.$set(regUser.uid, userInfo);
            }); //promise
        }
        , //register

        requireAuth: function () {
            return auth.$requireAuth();
        }
        , //require Authentication

        waitForAuth: function () {
            return auth.$waitForAuth();
        } //Wait until user is Authenticated



    }; //myObject
    return myObject;
}); //myApp Factory