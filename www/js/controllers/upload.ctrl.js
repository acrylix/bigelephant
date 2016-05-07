angular.module('upload.controllers', [])

.controller('FrameSelectController', [
	'$state',
	'$scope',
	'$rootScope',
	'$ionicPopup',
	'UserService',
	'StorageService',
	'PictureService',
	'$ionicNavBarDelegate',
	'$q',
	function($state, $scope, $rootScope, $ionicPopup, UserService, StorageService, PictureService, $ionicNavBarDelegate, $q) {

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

		function encodeFile(imageURI) {
			debugger;
			var defer = $q.defer();

			window.plugins.Base64.encodeFile(imageURI, function(base64) {

				base64 = base64.replace(/^data:image\/png;base64,/, ''); //VERY QUESTIONABLE PERFORMANCE

				var d = new Date();
				var n = d.getTime();

				var file = new AV.File('pic' + n + '.jpg', {
					base64: base64
				});
				file.save().then(function(obj) {
				  // 数据保存成功
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

			for (var i = 0; i < $scope.frames.length; i++) {
				if ($scope.frames[i].checked) {
					// frameIds.push($scope.frames[i].frame.id);
					for (var j = 0; j < files.length; j++) {
						var frameId = $scope.frames[i].frame.id;

						promises.push(saveFileOfFrameItem(frameId, files[j]));
					}
				}
			}

			$q.all(promises).then(function(files) {
				//NICE!
				debugger;
			}).catch(function (error) {
				console.log("FOF batch err: "+error);
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
			// $rootScope.uploading ? $rootScope.uploading = false : $rootScope.uploading = true;
			debugger;

			var files = [];
			var promises = [];
			var imageUris = PictureService.getAll();

			for (var i = 0; i < imageUris.length; i++) {
				promises.push(encodeFile(imageUris[i]));
			}

			$q.all(promises).then(function(files) {
				files.push(files);
				fileOfFrameEntry(files);
				debugger;
			});

			debugger;


		}

		$scope.frames = StorageService.getAll();

		for (var i = 0; i < $scope.frames.length; i++) {
			$scope.frames[i].checked = false;
		}

	}
]);