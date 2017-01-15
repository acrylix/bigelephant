angular.module('test.controllers', ['ionic'])
	.controller('TestController', function(
		$scope,
		$state,
		$rootScope,
		$q,
		$cordovaFile,
		$rootScope,
		$cordovaMedia,
		PictureService,
		$ionicHistory,
		$ionicPopup,
		$cordovaFile) {

		$scope.frames = $rootScope.selectedFrames;

		function encodeFile(imageURI, index) {
			// debugger;

			var defer = $q.defer();

			if ($rootScope.type == 'camera') {
				var data = PictureService.getTmpImg();

				var d = new Date();
				var n = d.getTime();

				var file = new AV.File('pic' + n + '.jpg', {
					base64: data
				});
				file.save().then(function(obj) {
					console.log("file SAVED");
					$rootScope.$broadcast('upload-increment');
					console.log(obj.url());
					PictureService.clearTmpImg();
					defer.resolve(obj);
				}, function(err) {
					// 数据保存失败
					console.log(err);
					PictureService.clearTmpImg();
					defer.reject(err);
				});
			}
			if ($rootScope.type == 'album') {

				console.log("Begin Encode");
				var filename = imageURI.replace(/^.*[\\\/]/, '');
				var path = imageURI.replace(/[^\/]*$/, '');

				$cordovaFile.readAsDataURL(path, filename).then(function(data) {

					var clean64 = /^data:image\/.*;base64,/;

					if (clean64.test(data)) {
						base64 = data.replace(clean64, ''); //VERY QUESTIONABLE PERFORMANCE

						var d = new Date();
						var n = d.getTime();

						var ext = filename.split('.').pop();

						console.log("Got Encode for " + 'pic' + n + '.' + ext);
						var file = new AV.File('pic' + n + '.' + ext, {
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
					} else {
						alert('img format err');
						defer.reject('image format err');
					}

				});
			}
			return defer.promise;
		}

		function fileOfFrameEntry(files, rec) {
			var promises = [];

			console.log("FOF Entry");

			for (var i = 0; i < $scope.frames.length; i++) {
				if ($scope.frames[i].checked) {
					// frameIds.push($scope.frames[i].frame.id);

					var frameId = $scope.frames[i].frame.id;

					if ($rootScope.type == 'album') {
						for (var j = 0; j < files.length - 1; j++) {

							console.log("Saving FOF multi");
							promises.push(saveFileOfFrameItem(frameId, files[j], rec));
						}
					}
					if ($rootScope.type == 'camera') {

						console.log("Saving FOF camera single");
						promises.push(saveFileOfFrameItem(frameId, files[0], rec));
					}
				}
			}

			$q.all(promises).then(function(files) {
				//NICE!
				console.log("END");
				$rootScope.$broadcast('upload-completed');

				var myPopup = $ionicPopup.show({

					title: '上传结束',
					buttons: [{
						text: 'Ok',
						type: 'button-energized'
					}, ]
				});

			}).catch(function(error) {
				console.log("FOF batch err: " + error);
			});

		}

		function saveFileOfFrameItem(frameId, file, rec) {
			var defer = $q.defer();

			var FOF = AV.Object.extend('FileOfFrame');
			var fof = new FOF();
			var frame = AV.Object.createWithoutData('Frame', frameId);
			fof.set('frame', frame);
			fof.set('sender', AV.User.current());
			fof.set('file', file);
			if (rec != null) {
				fof.set('record', rec);
			}
			fof.save().then(function(fof) {
				console.log('New FOF created with objectId: ' + fof.id);
				defer.resolve(fof.id);
			}, function(err) {
				console.log('Failed to create new FOF, with error message: ' + err.message);
				defer.reject();
			});

			return defer.promise;
		}

		function uploadRecordingFile() {

			var defer = $q.defer();

			if (!$scope.recordingExists) {
				defer.resolve(null);
				return;
			};

			var recordingUri = PictureService.getRecordingUri();

			console.log(recordingUri);

			var path = cordova.file.dataDirectory;

			if (ionic.Platform.isAndroid()) {
				path = cordova.file.externalDataDirectory;
			}

			// $cordovaFile.readAsDataURL(cordova.file.externalDataDirectory, "recording.wav")
			//$cordovaFile.readAsDataURL(cordova.file.dataDirectory + "ElephantPics/", "recording.wav")
			$cordovaFile.readAsDataURL(path, "recording.wav")
				.then(function(data) {
					// success

					var clean64 = /^data:audio\/.*;base64,/;

					if (clean64.test(data)) {

						data = data.replace(clean64, '');

						var file = new AV.File('recording.wav', {
							base64: data
						});
						file.save().then(function(obj) {
							// 数据保存成功
							console.log("file SAVED");
							defer.resolve(obj);

						}, function(err) {
							// 数据保存失败
							console.log(err);
							defer.reject(err);

						});
					} else {
						console.log('recording format not supported');
						defer.reject();
					}
				}, function(error) {
					// error
					console.log(error);
				});

			return defer.promise;

		}

		$scope.send = function() {

			if ($rootScope.type == 'album') {
				var files = [];
				var promises = [];
				var imageUris = PictureService.getAll(); //PROBLEM

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

					uploadRecordingFile().then(function(rec) {
						fileOfFrameEntry(files, rec);
					}, function(err) {
						fileOfFrameEntry(files, null);
					});

					$rootScope.uploading = true;
					//debugger;
				});
			}
			if ($rootScope.type == 'camera') {
				var files = [];

				$rootScope.$broadcast('upload-started', {
					total: 1
				});

				console.log("Start");

				encodeFile(null, null).then(function(file) {
					files.push(file);

					uploadRecordingFile().then(function(rec) {
						fileOfFrameEntry(files, rec);
					}, function(err) {
						fileOfFrameEntry(files, null);
					});
					$rootScope.uploading = true;
					//debugger;

				}, function(err) {
					console.log('camera upload failed');
				})

			}

			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true
			});

			$state.go('app.playlists');

		}

		// |
		// |
		// |
		// |
		// |
		// |

		$scope.cancel = function() {
			$ionicHistory.nextViewOptions({
				disableBack: true
			});

			$state.go('app.playlists');
		}

		var mediaRec;

		//timer
		var timer;
		$scope.time = 0;
		$scope.recording = false;
		$scope.recordingExists = false;

		$scope.startTimer = function() {
			console.log('started');

			if (angular.isDefined(timer)) return;
			$scope.time = 0;
			$scope.recordingExists = false;

			PictureService.deleteRecording("recording.wav").then(function(success) {


				mediaRec = new Media("recording.wav", ///var/mobile/Applications/<UUID>/tmp/myrecording.wav
					// success callback
					function() {
						console.log("recordAudio():Audio Success");
					},

					// error callback
					function(err) {
						console.log("recordAudio():Audio Error: " + err.code);
					});

				mediaRec.startRecord();
				$scope.timeDisp = Math.floor($scope.time / 1000 / 60) + ':' + pad(Math.floor($scope.time / 1000 % 60), 2);

				timer = setInterval(function() {
					$scope.recording = true;
					$scope.time += 100;
					$scope.timeDisp = Math.floor($scope.time / 1000 / 60) + ':' + pad(Math.floor($scope.time / 1000 % 60), 2);
					$scope.$apply();
					// console.log($scope.time);
				}, 100);

			}, function(error) {
				alert('cannot start recording');
			});
		};

		$scope.stopTimer = function() {
			console.log('stopped');
			if (angular.isDefined(timer)) {
				mediaRec.stopRecord();

				$scope.timeDisp = '';
				clearInterval(timer);
				$scope.recording = false;
				$scope.recordingExists = true;
				timer = undefined;
				$scope.$apply();

				PictureService.copyRecordingToMem("recording.wav");
			}
		};

		$scope.playRecording = function() {
			mediaRec.play();
		}

		var pad = function(n, width, z) {
			z = z || '0';
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		}


	});