angular.module('user.controllers', [])

.controller('LogInController', [
	'$state',
	'$scope',
	'$rootScope',
	'$ionicPopup',
	'UserService',
	function($state, $scope, $rootScope, $ionicPopup, UserService) {

		$scope.creds = {
	        phonenumber: "18811713937",
	        password: "123qwe"
	    };

	    $scope.doLoginAction = function () {
                $rootScope.show();
                UserService.login($scope.creds.phonenumber, $scope.creds.password)
                    .then(function (user) {
                        $rootScope.hide();
                        console.log(user);
                        $state.go('app.playlists');

                    }, function (error) {
                        $rootScope.hide();
                        console.log("login err + "+error);
                        $ionicPopup.confirm({
                          title: 'Oops!',
                          template: error.avosErr.message
                        });
                    })
            };

	}])

.controller('SignUpController', [
	'$state',
	'$scope',
	'$rootScope',
	function($state, $scope, $rootScope) {

	}])

;