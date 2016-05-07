angular.module('camera.controllers', ['ngCordova'])

// CAMERA VIEW CONTROLLER deprecated...
.controller('CameraCtrl', function($scope, $cordovaFile, $ionicLoading, $cordovaSocialSharing, $ionicHistory, $ionicLoading) {


     $scope.$on("$ionicView.enter", function(event) {
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
    });

   // LOAD IMAGE FROM THE CAMERA
   $scope.takePhoto = function() {

      navigator.camera.getPicture(function(imageURI) {

      var image = new Image();

          image.onload = function() {  // WE MUST WAIT FOR IMAGE TO LOAD BEFORE DRAWING

             $scope.imageSRC = image ;
              var canvas =  document.getElementById('myCanvas');
              canvas.width = image.width;
              canvas.height = image.height;

              var ctx = canvas.getContext("2d");
              ctx.drawImage(image, 0,0, image.width,image.height); // DRAW THE IMAGE ONTO CANVAS
        };

          image.src = imageURI; // SET THE IMAGE SOURCE

        }, function(message) {
            console.log("error " + message);
            //error
        }, {
            quality:50,
            sourceType: navigator.camera.PictureSourceType.CAMERA
        });
  }

    // LOAD IMAGE FROM PHOTO LIBRARY
    $scope.selectPicture = function() {

      navigator.camera.getPicture(function(imageURI) {

            var image = new Image();

            image.onload = function() {

              $scope.imageSRC = image ;
              var canvas =  document.getElementById('myCanvas');
              canvas.width = image.width;
              canvas.height = image.height;

              var ctx = canvas.getContext("2d");
              ctx.drawImage(image, 0,0, canvas.width, canvas.height ); // DRAW THE IMAGE ONTO CANVAS
        };

          image.src = imageURI; // SET THE IMAGE SOURCE

        }, function(message) {
            console.log("error " + message);
            //error
        }, {
            quality: 50,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
	}

  // ROTATE IMAGE FUNCTION
  $scope.rotateImage = function(degree){

     $ionicLoading.show({
            template: 'Working...'
      });

      // DEPENDING ON THE SIZE OF THE IMAGE, THE ROTATION CAN ALSO BE CPU HEAVY
      // BECAUSE IT NEEDS TO REDRAW THE IMAGE

      setTimeout( function() { // SET A TIMEOUT SO THAT THE LOADING POPUP CAN BE SHOWN

      var image = $scope.imageSRC ;

      var canvas =  document.getElementById('myCanvas');

      // swap the width and height for 90 degree rotation
      canvas.width = image.height;
      canvas.height = image.width;

      var ctx = canvas.getContext("2d");

      // translate context to center of canvas
      ctx.translate(image.height / 2, image.width / 2);
      ctx.rotate((Math.PI/180) * degree); // rotate image

      // draw the new rotated image
      ctx.drawImage(image, - image.width / 2, - image.height / 2, image.width, image.height);

      $scope.imageSRC.src = canvas.toDataURL(); // save the new original image

      }, 100);

      setTimeout( function() {$ionicLoading.hide();},100); // HIDE THE POPUP AFTER IT'S DONE
  }

  // SHARE OR SAVE PHOTO FUNCTION
  $scope.sharePhoto = function(){

    $ionicLoading.show({
            template: 'Working...'
      });

    var canvas =  document.getElementById('myCanvas');
    // save canvas image as data url (png format by default)
    var dataURL = canvas.toDataURL();

    

   $cordovaSocialSharing
    .share("title", "message", dataURL, "link") // Share via native share sheet
    .then(function(result) {
      $ionicLoading.hide();
      // Success!
    }, function(err) {
      $ionicLoading.hide();
      // An error occured. Show a message to the user
    });
  }
});
