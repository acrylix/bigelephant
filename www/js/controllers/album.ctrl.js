angular.module('album.controllers', ['ionic'])

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
	$cordovaBarcodeScanner,
	StorageService,
	$ionicModal,
	$ionicPopup,
	$interval,
	$cordovaToast,
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

	//Smart Search
	$scope.myPopup = function() {
		$scope.data = {};

		$ionicPopup.show({
			template: '<input type="text" class="smart-search-input" ng-model="data.searchKeyWord">',
			title: '智能搜索',
			subTitle: 'ex. 美食',
			scope: $scope,
			buttons: [{
				text: '取消'
			}, {
				text: '<b>搜索</b>',
				type: 'button-energized',
				onTap: function(e) {
					$state.go('app.smartGallery', {
						key: $scope.data.searchKeyWord
					})
				}
			}]
		})
	};
	//Smart Search

	var renameFrameAction = function(frame, newName) {
		console.log(frame.id + '- ' + newName);
		$rootScope.show();

		var Muf = AV.Object.extend('MapUserFrame');
		var query = new AV.Query(Muf);

		query.get(frame.id).then(function(muf) {
			muf.set('frameNickName', newName);
			muf.save().then(function() {
				$rootScope.hide();
				$scope.listRefresh();
			}, function(error) {
				$rootScope.hide();
				console.log('error ' + error);
			});

		}, function(error) {
			$rootScope.hide();
			console.log('error ' + error);
		});
	}

	$scope.renameFrame = function(frame) {
		$scope.data = {};

		$ionicPopup.show({
			template: '<input type="text" class="smart-search-input" ng-model="data.newName">',
			title: '修改备注',
			scope: $scope,
			buttons: [{
				text: '取消'
			}, {
				text: '<b>确定</b>',
				type: 'button-energized',
				onTap: function(e) {
					renameFrameAction(frame, $scope.data.newName);
				}
			}]
		})
	};

	$scope.moveItem = function(item, fromIndex, toIndex) {
		$scope.items.splice(fromIndex, 1);
		$scope.items.splice(toIndex, 0, item);
	};

	$scope.takePic = function() {

		PictureService.clearFileCache(); //REMOVE THIS BEFORE FLIGHT!!!!

		$ionicPlatform.ready(function() {
			var options = {
				quality: 80,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				// popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: true,
				correctOrientation: true
			};

			$cordovaCamera.getPicture(options).then(function(imageData) {
				//var base64 = "data:image/jpeg;base64," + imageData;
				debugger;

				//var tempFileName = imageURI.replace(/^.*[\\\/]/, '');

				PictureService.prepDir().then(function(success) {
					//PictureService.copyToMem(imageURI);
					PictureService.addTmpImg(imageData);
					$rootScope.type = 'camera';
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

							//var tempFileName = filePath.replace(/^.*[\\\/]/, '');

							PictureService.copyToMem(filePath);
							$rootScope.type = 'album';

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

	var fillFramesArrayURL = function(frameId, URL) {
		for (var i = 0; i < $scope.frames.length; i++) {
			if ($scope.frames[i].frame.id == frameId) {
				$scope.frames[i].latestImg = URL;
				break;
			}
		}
	}

	$scope.test = function() {
		// debugger;
		var query = new AV.Query('PhotoTag');

		query.equalTo('objectId', '572e454479df540060b962df');
		query.include('fileOfFrame');
		query.first().then(function(data) {
			// debugger;
			var file = data.attributes.fileOfFrame.attributes.file;

		}, function(error) {
			console.log(error);

		});

	}

	var getLatestFrameImg = function(frameId) { ///
		var defer = $q.defer();
		var query = new AV.Query('FileOfFrame');

		var frame = AV.Object.createWithoutData('Frame', frameId);
		query.equalTo('frame', frame);
		query.equalTo('sender', AV.User.current());
		query.descending('createdAt');
		query.first().then(function(data) {
			console.log(" + " + data.attributes.file._url + " " + frameId);

			var thumbnail = data.attributes.file.thumbnailURL(300, 300, 10);
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
			// debugger;
			//$scope.frames = results;
			for (var i = results.length - 1; i >= 0; i--) {
				console.log(results[i].attributes.frame.id);
				// debugger;
				var frameItem = {
					id: results[i].id,
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

	$scope.deteleFrame = function(frame, index) {

		this.frames.splice(index, 1);
		var frame = AV.Object.createWithoutData('MapUserFrame', frame.id);
		frame.destroy().then(function() {
			console.log('destroyed MUF ' + frame.id);
		}, function(error) {
			console.log('destroyed MUF failed ' + error);
		});
	}

	var checkFrame = function(id) {
		var defer = $q.defer();

		var query = new AV.Query('Frame');
		query.equalTo('deviceIdShort', id);
		query.first().then(function(data) {
			console.log('frame found');
			defer.resolve(data);
		}, function(error) {
			console.log('frame not found');
			defer.reject();
		});

		return defer.promise;
	}

	var addFriendFrame = function(qr) {
		checkFrame(qr).then(function(frame) {
			if (!frame) {
				var myPopup = $ionicPopup.show({

					title: '没有找到可添加相框',
					buttons: [{
						text: 'Ok',
						type: 'button-energized'
					}, ]
				});
			} else {
				$scope.frameData = {};
				$scope.frameData.id = frame.id;
				$scope.frameData.deviceIdShort = frame.attributes.deviceIdShort;
				$scope.frameData.deviceId = frame.attributes.deviceId;

				$scope.modal.show();
			}
		}, function(error) {
			alert('frame not found');
		})
	}

	$ionicModal.fromTemplateUrl('templates/addFrame.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.closeAddFrame = function() {
		$scope.modal.hide();
	};

	function saveMapUserFrame() {
		var defer = $q.defer();

		var MUF = AV.Object.extend('MapUserFrame');
		var muf = new MUF();
		var frame = AV.Object.createWithoutData('Frame', $scope.frameData.id);
		muf.set('frame', frame);
		muf.set('frameDeviceId', $scope.frameData.deviceId);
		muf.set('userNickName', $scope.frameData.userNickName);
		muf.set('frameNickName', $scope.frameData.frameNickName);
		muf.set('user', AV.User.current());

		muf.save().then(function(muf) {
			defer.resolve(muf.id);
		}, function(err) {
			console.log('Failed to create new muf, with error message: ' + err.message);
			defer.reject();
		});

		return defer.promise;
	}

	$scope.addFriendFrameSave = function() {
		debugger;
		saveMapUserFrame().then(function(id) {
			console.log('LINKED MUF ID: ' + id);
			$scope.modal.hide();
		}, function(error) {

		});
	}

	$scope.button = function() {

		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {

				console.log(barcodeData);

				addFriendFrame(barcodeData.text);

			}, function(error) {
				// An error occurred
			});

	}

	$scope.listRefresh = function() {
		StorageService.clear();

		getFrame().then(function(success) {
			$scope.$broadcast('scroll.refreshComplete');
		}, function(error) {
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		// console.log('*****'+fromState.url);
		if (StorageService.isEmpty() || fromState.url == "^") {
			getFrame();
		} else {
			$scope.frames = StorageService.getAll();
		}
	});


})