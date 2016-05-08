angular.module('album.controllers', [])

.controller('AlbumController', function(
	$scope,
	$state,
	$q,
	$ionicActionSheet,
	$cordovaFile,
	$ionicLoading,
	$rootScope,
	$cordovaImagePicker,
	$ionicPlatform,
	$cordovaCamera,
	StorageService,
	PictureService) {

	//background loader//
	$scope.showUpload = false;

	$rootScope.$on('upload-started', function(event, args) {
		$scope.showUpload = true;
		$scope.total = args.total;
		$scope.current = 0;
	});
	$rootScope.$on('upload-increment', function(event, args) {
		if ($scope.current < $scope.total) {
			$scope.current++;
		}
	});
	$rootScope.$on('upload-completed', function(event, args) {
		$scope.showUpload = false;
	});
	//background loader//

	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.listCanSwipe = true;

	$scope.moveItem = function(item, fromIndex, toIndex) {
		$scope.items.splice(fromIndex, 1);
		$scope.items.splice(toIndex, 0, item);
	};

	$scope.takePic = function() {

		PictureService.clearFileCache(); //REMOVE THIS BEFORE FLIGHT!!!!

		$ionicPlatform.ready(function() {
			var options = {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: true,
				correctOrientation: true
			};

			$cordovaCamera.getPicture(options).then(function(imageURI) {
				//var base64 = "data:image/jpeg;base64," + imageData;
				debugger;

				var url;

				var tempFileName = imageURI.replace(/^.*[\\\/]/, '');

				PictureService.prepDir().then(function(success) {
					PictureService.copyToMem(tempFileName);
				});

				$state.go('app.selectFrame', {});


			}, function(err) {
				// error
				console.log(error);
			});
		});
	}

	$scope.imagePicker = function() {

		PictureService.clearFileCache(); //REMOVE THIS BEFORE FLIGHT!!!!

		var options = {
			maximumImagesCount: 10,
			width: 800,
			height: 800,
			quality: 80
		};

		$ionicPlatform.ready(function() {

			$cordovaImagePicker.getPictures(options)
				.then(function(results) {

					PictureService.prepDir().then(function(success) {

						for (var i = 0; i < results.length; i++) {
							console.log('Image URI: ' + results[i]);
							var filePath = results[i];

							var tempFileName = filePath.replace(/^.*[\\\/]/, '');

							PictureService.copyToMem(tempFileName);

							$state.go('app.selectFrame', {});

						}

					});

				}, function(error) {
					// error getting photos
					console.log(error);
				});
		});

	}

	$scope.cameraButton = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			buttons: [{
				text: '<b>拍照</b>'
			}, {
				text: '从手机相册选择'
			}],
			// destructiveText: 'Delete',
			titleText: '发照片',
			cancelText: '取消',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				if (index == 0) {
					$scope.takePic();
				} else if (index == 1) {
					$scope.imagePicker();
				}

				return true;
			}

		});

	};

	$scope.frames = [];
	$scope.frameImg = {};

	var fillFramesArrayURL = function(frameId, URL){
		for (var i = 0; i < $scope.frames.length; i++) {
			if($scope.frames[i].frame.id == frameId){
				$scope.frames[i].latestImg = URL;
				break;
			}
		}
	}

	$scope.test = function(){
		debugger;
	}

	var getLatestFrameImg = function(frameId) { ///
		var defer = $q.defer();
		var query = new AV.Query('FileOfFrame');

		var frame = AV.Object.createWithoutData('Frame', frameId);
		query.equalTo('frame', frame);
		query.equalTo('sender', AV.User.current());
		query.descending('createdAt');
		query.first().then(function(data) {
			console.log(" + " + data.attributes.file._url + " "+ frameId);

			var thumbnail = data.attributes.file.thumbnailURL(500, 500,50);
			fillFramesArrayURL(frameId, thumbnail);

			defer.resolve(data.attributes.file._url);
		}, function(error) {
			console.log(error);
			defer.reject(error);
		});

		return defer.promise;

	}
	var getFrame = function() {
		var defer = $q.defer();

		StorageService.clear();
		$scope.frames = [];

		var query = new AV.Query('MapUserFrame');
		query.include('frame');
		query.equalTo('user', AV.User.current());
		query.find().then(function(results) {
			console.log('Successfully retrieved ' + results.length + ' posts.');
			// 处理返回的结果数据
			debugger;
			//$scope.frames = results;
			for (var i = results.length - 1; i >= 0; i--) {
				console.log(results[i].attributes.frame.id);
				debugger;
				var frameItem = {
					frame: {
						id: results[i].attributes.frame.id,
						deviceIdShort: results[i].attributes.frame.attributes.deviceIdShort
					},
					frameDeviceId: results[i].attributes.frameDeviceId,
					frameNickName: results[i].attributes.frameNickName,
					totalImage: results[i].attributes.totalImage,
					userNickName: results[i].attributes.userNickName,
					user: {
						id: results[i].attributes.user.id,
						cid: results[i].attributes.user.cid,
					}
				}
				StorageService.add(frameItem);

			}
			$scope.frames = StorageService.getAll();

			for (var i = 0; i < $scope.frames.length; i++) {
				$scope.frames[i]
				getLatestFrameImg($scope.frames[i].frame.id).then(function(url) {

				}, function(error) {
					console.log("album cover err: " + error);
				});
			}

			$scope.$apply();
			defer.resolve();

		}, function(error) {
			console.log('Error: ' + error.code + ' ' + error.message);
			defer.reject(error);
		});

		return defer.promise;
	}
	$scope.button = function() {
		// console.log($scope.frameImg);
		var temp = StorageService.get('56ab71ecd342d300543803ca');
		console.log(temp);

		var imageUri = PictureService.getAll()[0];

		window.plugins.Base64.encodeFile(imageUri, function(base64) {
			debugger;
			base64 = base64.replace(/^data:image\/png;base64,/, ''); //VERY QUESTIONABLE PERFORMANCE

			var file = new AV.File('myfileNew.jpg', {
				base64: base64
			});
			file.save().then(function(obj) {
				// 数据保存成功
				debugger;
				console.log("IMG SAVED TO AV:" + obj.url());
			}, function(err) {
				// 数据保存失败
				console.log("ERR:" + err);
			});

		});

	}

	$scope.listRefresh = function() {
		StorageService.clear();

		getFrame().then(function(success){
			$scope.$broadcast('scroll.refreshComplete');
		},function(error){
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	if (StorageService.isEmpty()) {
		getFrame();
	} else {
		$scope.frames = StorageService.getAll();
	}

})