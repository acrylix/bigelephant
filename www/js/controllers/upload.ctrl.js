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

			// debugger;

			// var files = [];
			// var promises = [];
			// var imageUris = PictureService.getAll();

			// $rootScope.$broadcast('upload-started', {
			// 	total: imageUris.length
			// });

			// console.log("Start");
			// for (var i = 0; i < imageUris.length; i++) {
			// 	console.log("URI: " + imageUris[i]);
			// 	promises.push(encodeFile(imageUris[i], i + 1));
			// }

			// $q.all(promises).then(function(files) {
			// 	files.push(files);
			// 	fileOfFrameEntry(files);
			// 	$rootScope.uploading = true;
			// 	debugger;
			// });

			// debugger;
			$rootScope.selectedFrames = $scope.frames;

			$ionicHistory.nextViewOptions({
				disableBack: true
			});

			$state.go('app.test');

		}

		$scope.frames = StorageService.getAll();

		for (var i = 0; i < $scope.frames.length; i++) {
			$scope.frames[i].checked = false;
		}

	}
]);