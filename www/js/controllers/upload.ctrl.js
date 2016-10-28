angular.module('upload.controllers', [])

.controller('FrameSelectController', [
	'$state',
	'$scope',
	'$rootScope',
	'$ionicPopup',
	'UserService',
	'StorageService',
	'PictureService',
	'$ionicPopup',
	'$ionicHistory',
	'$ionicNavBarDelegate',
	'$q',
	function($state, $scope, $rootScope, $ionicPopup, UserService, StorageService, PictureService, $ionicPopup, $ionicHistory, $ionicNavBarDelegate, $q) { 
		$ionicNavBarDelegate.showBackButton(false);

		$scope.cancel = function() {
			$state.go('app.playlists');
		}



		$scope.send = function() {

			var nonSelected = true;

			for (var i = 0; i < $scope.frames.length; i++) {
				if ($scope.frames[i].checked == true) {
					nonSelected = false;
					break;
				}
			}

			if (nonSelected) {
				$ionicPopup.show({

					title: '没选相框?',
					subTitle: '请选择至少一个相框上传',
					buttons: [{
						text: 'Ok',
						type: 'button-energized'
					}, ]
				});
			} else {
				$rootScope.selectedFrames = $scope.frames;

				$ionicHistory.nextViewOptions({
					disableBack: true
				});

				$state.go('app.test');
			}

		}

		$scope.frames = StorageService.getAll();

		for (var i = 0; i < $scope.frames.length; i++) {
			$scope.frames[i].checked = false;
		}

	}
]);