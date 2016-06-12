angular.module('test.controllers', ['ionic'])
.controller('TestController', function(
	$scope,
	$state,
	$q,
	$cordovaFile,
	$rootScope,
	StorageService,
	$cordovaMedia,
	PictureService,
	$cordovaFile) {

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

	$scope.saveFile = function() {
		var recordingUri = PictureService.getRecordingUri();

		console.log(recordingUri);

		$cordovaFile.readAsDataURL(cordova.file.dataDirectory + "ElephantPics/", "recording.wav")
			.then(function(data) {
				// success

				data = data.replace(/^data:audio\/wav;base64,/, ''); //VERY QUESTIONABLE PERFORMANCE

				var file = new AV.File('recording.wav', {
					base64: data
				});
				file.save().then(function(obj) {
					// 数据保存成功
					console.log("file SAVED");

				}, function(err) {
					// 数据保存失败
					console.log(err);

				});
			}, function(error) {
				// error
			});


	}

	var pad = function(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}


});