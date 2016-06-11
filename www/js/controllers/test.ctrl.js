angular.module('test.controllers', ['ionic'])

.controller('TestController', function(
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
	$cordovaMedia,
	PictureService,
	PictureService) {

	// $scope.record = function() {
	// 	var src = "myrecording.wav";
	// 	var mediaRec = new Media(src, ///var/mobile/Applications/<UUID>/tmp/myrecording.wav
	// 		// success callback
	// 		function() {
	// 			console.log("recordAudio():Audio Success");
	// 		},

	// 		// error callback
	// 		function(err) {
	// 			console.log("recordAudio():Audio Error: " + err.code);
	// 		});

	// 	// Record audio
	// 	mediaRec.startRecord();

	// 	// Pause Recording after 5 seconds
	// 	setTimeout(function() {
	// 		mediaRec.stopRecord();
	// 		console.log('paused');
	// 		mediaRec.play();
	// 	}, 5000);

	// }

	var mediaRec;

	//timer
	var timer;
	$scope.time = 0;
	$scope.recording = false;
	$scope.recordingExists = false;

	$scope.startTimer = function() {
		// Don't start a new fight if we are already fighting
		if (angular.isDefined(timer)) return;
		$scope.time = 0;
		$scope.recordingExists = false;
		$scope.$apply();
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
			$scope.$apply();
			
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
		if (angular.isDefined(timer)) {
			mediaRec.stopRecord();
			PictureService.copyRecordingToMem("recording.wav");
			clearInterval(timer);
			$scope.recording = false;
			$scope.recordingExists = true;
			timer = undefined;
			$scope.$apply();
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


	$rootScope.$on('stop-timer', function(event, args) {
		console.log('timer stopped');
		$scope.timeDisp = '';
		$scope.stopTimer();
	});

}).directive('gestureOnHold', function($ionicGesture, $rootScope) {
	return function(scope, element, attrs) {
		$ionicGesture.on('hold', function() {
			scope.$apply(function() {
				console.log("held");
				scope.$eval(attrs.gestureOnHold)
			});
		}, element);
		$ionicGesture.on('release', function() {
			scope.$apply(function() {
				console.log("released");
				$rootScope.$broadcast('stop-timer');
				//scope.$eval(attrs.gestureOnHold)
			});
		}, element);
	}
});