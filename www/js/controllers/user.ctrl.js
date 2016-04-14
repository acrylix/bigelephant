angular.module('user.controllers', [])

.controller('LogInController', [
	'$state',
	'$scope',
	'$rootScope',
	function($state, $scope, $rootScope) {
		AV.User.logIn('michael', '123qwe').then(function(user) {
		  // 成功了，现在可以做其他事情了
		  console.log(user);
		}, function(error) {
		  // 失败了
		  console.log(error);
		});


	}])

.controller('SignUpController', [
	'$state',
	'$scope',
	'$rootScope',
	function($state, $scope, $rootScope) {

	}])

;