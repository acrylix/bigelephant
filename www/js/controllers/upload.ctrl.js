angular.module('upload.controllers', [])

.controller('FrameSelectController', [
	'$state',
	'$scope',
	'$rootScope',
	'$ionicPopup',
	'UserService',
	'StorageService',
	'$ionicNavBarDelegate',
	function($state, $scope, $rootScope, $ionicPopup, UserService, StorageService, $ionicNavBarDelegate) {

		$ionicNavBarDelegate.showBackButton(false);

		$scope.devList = [{
			text: "HTML5",
			checked: true
		}, {
			text: "CSS3",
			checked: false
		}, {
			text: "JavaScript",
			checked: false
		}];

		$scope.send = function(){
		   $rootScope.uploading ? $rootScope.uploading = false : $rootScope.uploading = true;
		}

		$scope.frames = StorageService.getAll();

		for (var i = 0; i < $scope.frames.length; i++) {
			$scope.frames[i].checked = false;
		}

	}
])
;