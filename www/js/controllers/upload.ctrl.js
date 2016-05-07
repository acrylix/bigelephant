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
	'$ionicNavBarDelegate',
	'$q',
	function($state, $scope, $rootScope, $ionicPopup, UserService, StorageService, PictureService, $ionicPopup, $ionicNavBarDelegate, $q) {

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

		$scope.cancel = function() {
			$state.go('app.playlists');
		}

		function encodeFile(imageURI, index) {
			debugger;

			var defer = $q.defer();
			console.log("Begin Encode");
			window.plugins.Base64.encodeFile(imageURI, function(base64) {

				base64 = base64.replace(/^data:image\/png;base64,/, ''); //VERY QUESTIONABLE PERFORMANCE

				var d = new Date();
				var n = d.getTime();
				console.log("Got Encode for " + 'pic' + n + '.jpg');
				var file = new AV.File('pic' + n + '.jpg', {
					base64: base64
				});
				file.save().then(function(obj) {
					// 数据保存成功
					console.log("file SAVED");
					$rootScope.$broadcast('upload-increment');
					console.log(obj.url());
					defer.resolve(obj);
				}, function(err) {
					// 数据保存失败
					console.log(err);
					defer.reject(err);
				});

			});
			return defer.promise;
		}

		function fileOfFrameEntry(files) {
			var promises = [];

			console.log("FOF Entry");

			for (var i = 0; i < $scope.frames.length; i++) {
				if ($scope.frames[i].checked) {
					// frameIds.push($scope.frames[i].frame.id);
					for (var j = 0; j < files.length - 1; j++) {
						var frameId = $scope.frames[i].frame.id;

						console.log("Saving FOF");
						promises.push(saveFileOfFrameItem(frameId, files[j]));
					}
				}
			}

			$q.all(promises).then(function(files) {
				//NICE!
				console.log("END");
				$rootScope.$broadcast('upload-completed');

				var myPopup = $ionicPopup.show({

					title: '上传结束',
					subTitle: '用时秒',
					buttons: [{
						text: 'Cancel',
						type: 'button-energized'
					}, ]
				});

			}).catch(function(error) {
				console.log("FOF batch err: " + error);
			});

		}

		function saveFileOfFrameItem(frameId, file) {
			var defer = $q.defer();

			var FOF = AV.Object.extend('FileOfFrame');
			var fof = new FOF();
			var frame = AV.Object.createWithoutData('Frame', frameId);
			fof.set('frame', frame);
			fof.set('sender', AV.User.current());
			fof.set('file', file);
			fof.save().then(function(fof) {
				console.log('New FOF created with objectId: ' + fof.id);
				defer.resolve(fof.id);
			}, function(err) {
				console.log('Failed to create new FOF, with error message: ' + err.message);
				defer.reject();
			});

			return defer.promise;
		}

		$scope.send = function() {

			debugger;

			var files = [];
			var promises = [];
			var imageUris = PictureService.getAll();

			$rootScope.$broadcast('upload-started', {
				total: imageUris.length
			});

			console.log("Start");
			for (var i = 0; i < imageUris.length; i++) {
				console.log("URI: " + imageUris[i]);
				promises.push(encodeFile(imageUris[i], i + 1));
			}

			$q.all(promises).then(function(files) {
				files.push(files);
				fileOfFrameEntry(files);
				$rootScope.uploading = true;
				debugger;
			});

			debugger;
			$state.go('app.playlists');

		}

		$scope.frames = StorageService.getAll();

		for (var i = 0; i < $scope.frames.length; i++) {
			$scope.frames[i].checked = false;
		}

	}
]);