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
	PictureService) {

	$scope.record = function(){
    var src = "myrecording.wav";
    var mediaRec = new Media(src, ///var/mobile/Applications/<UUID>/tmp/myrecording.wav
        // success callback
        function() {
            console.log("recordAudio():Audio Success");
        },

        // error callback
        function(err) {
            console.log("recordAudio():Audio Error: "+ err.code);
        });

    // Record audio
    mediaRec.startRecord();

    // Pause Recording after 5 seconds
    setTimeout(function() {
        mediaRec.stopRecord();
        console.log('paused');
        mediaRec.play();
    }, 5000);

    $scope.stop = function(){

    }

    $scope.time = 0;
    $scope.timer = function(){
    	console.log('test');
    }
}

});