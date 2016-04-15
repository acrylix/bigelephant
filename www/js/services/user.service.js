angular.module('user.services', [])
    .service('UserService', ['$q',
        function ($q) {

            return {

                /**
                 *
                 * @returns {*}
                 */
                init: function () {

                    var currentUser = AV.User.current();
                    if (currentUser) {
                      console.log("Authenticated user with id:", currentUser.id);
                      window.localStorage.setItem('user-id', currentUser.id);
                      return $q.when(currentUser);
                    } else {
                      return $q.reject({error: "noUser"});
                    }
                },
                /**
                 *
                 * @param _userParams
                 */
                createUser: function (_userParams) {

                    // var defered = $q.defer();
                    // var self = this;

                    // var ref = new Firebase("https://insider-app.firebaseio.com");
                    // ref.createUser({
                    //   email    : _userParams.username,
                    //   password : _userParams.password
                    // },  function(error, userData) {
                    //       if (error) { //FUCKED
                    //         console.log("Error creating user:", error);
                    //         defered.reject({error: "Error creating user:" + error});
                    //       } else { //SUCCESS
                    //         console.log("Successfully created user account with uid:", userData.uid);

                    //         defered.resolve(userData);
                    //       }
                    //   });

                    // return defered.promise;

                },
                /**
                 *
                 * @param _parseInitUser
                 * @returns {Promise}
                 */
                currentUser: function (_parseInitUser) {

                    // // if there is no user passed in, see if there is already an
                    // // active user that can be utilized
                    // _parseInitUser = _parseInitUser ? _parseInitUser : Parse.User.current();

                    // console.log("_parseInitUser " + Parse.User.current());
                    // if (!_parseInitUser) {
                    //     return $q.reject({error: "noUser"});
                    // } else {
                    //     return $q.when(_parseInitUser);
                    // }
                },
                /**
                 *
                 * @param _user
                 * @param _password
                 * @returns {Promise}
                 */
                login: function (_user, _password) {
                    var defered = $q.defer();

                    AV.User.logInWithMobilePhone(_user, _password).then(function(user) {
                      //登录成功
                      console.log('user.service: login success');
                      defered.resolve(user);
                    }, function(err) {
                      //登录失败
                      console.log('user.service: login failed + '+err.code +" msg: "+err.message);
                      defered.reject({avosErr: err});
                    });

                    return defered.promise;
                },
                /**
                 *
                 * @returns {Promise}
                 */
                logout: function (_callback) {
                    var defered = $q.defer();

                    AV.User.logOut();

                    defered.resolve();
                    return defered.promise;

                }
            }
        }]);
