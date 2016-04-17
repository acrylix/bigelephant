angular.module('starter.controllers', ['ngCordova'])
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        var content = element.find('a');
        element.css({
          // 'box-shadow': '10px -1px 200px rgba(0, 0, 0, 0.9)'
          
        });
        content.css({
          'box-shadow': 'rgba(0, 0, 0, 0.4) 0px -79px 55px -26px inset',
            'background': 'url(' + url +')',
            'background-size' : 'cover',
            'color': 'white'
        });
    }})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $ionicActionSheet, $cordovaFile, $ionicLoading, $cordovaImagePicker, $ionicPlatform, $cordovaCamera) {

$scope.shouldShowDelete = false;
 $scope.shouldShowReorder = false;
 $scope.listCanSwipe = true;

 $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };

  $scope.takePic = function() {

    $ionicPlatform.ready(function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
    correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var base64 = "data:image/jpeg;base64," + imageData;
      debugger;

      // var base64 = '6K+077yM5L2g5Li65LuA5LmI6KaB56C06Kej5oiR77yf';
      var file = new AV.File('myfile.txt', { base64: base64 });
      file.save().then(function(obj) {
        // 数据保存成功
        debugger;
        console.log(obj.url());
      }, function(err) {
        // 数据保存失败
        console.log(err);
      });

    }, function(err) {
      // error
    });
    });

    // navigator.camera.getPicture(function(imageURI) {

    // var image = new Image();

    //     image.onload = function() {  // WE MUST WAIT FOR IMAGE TO LOAD BEFORE DRAWING

    //        $scope.imageSRC = image ;
    //         var canvas =  document.getElementById('myCanvas');
    //         canvas.width = image.width;
    //         canvas.height = image.height;

    //         var ctx = canvas.getContext("2d");
    //         ctx.drawImage(image, 0,0, image.width,image.height); // DRAW THE IMAGE ONTO CANVAS
    //   };

    //     image.src = imageURI; // SET THE IMAGE SOURCE

    //   }, function(message) {
    //       console.log("error " + message);
    //       //error
    //   }, {
    //       quality:50,
    //       sourceType: navigator.camera.PictureSourceType.CAMERA
    //   });
  }

  $scope.imagePicker = function(){

    var options = {
     maximumImagesCount: 10,
     width: 800,
     height: 800,
     quality: 80
    };

    $ionicPlatform.ready(function() {

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
          }
        }, function(error) {
          // error getting photos
        });
    });

  }

  $scope.cameraButton = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: '<b>拍照</b>' },
       { text: '从手机相册选择' }
     ],
     // destructiveText: 'Delete',
     titleText: '发照片',
     cancelText: '取消',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
        if(index == 0){
          $scope.takePic();
        }
        else if(index == 1){
          $scope.imagePicker();
        }

        return true;
      }
     
   });

  };

  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 }
  ];

  $scope.frames = [];
  $scope.frameImg = {};

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
      $scope.frames.push(results[i]);
    }
    $scope.$apply();
    return results;

  }, function(error) {
    console.log('Error: ' + error.code + ' ' + error.message);
  }).then(function(frames){
    debugger;

    for (var i = 0; i < frames.length; i++) {
      var query = new AV.Query('FileOfFrame');
      query.addDescending('createdAt');
      query.equalTo('frame', frames[i].attributes.frame);
      query.first().then(function(data) {
        $scope.frameImg[data.attributes.frame.id] = data.attributes.file._url;
        $scope.$apply();
        console.log(" + "+data.attributes.file._url);
      }, function(error) {
        console.log(error);
      });
    }

  });

  $scope.button = function(){
    console.log($scope.frameImg);
  }




})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});




// var query = new AV.Query('FileOfFrame');
//       // 最新的在前面
//       query.addDescending('createdAt');
//       query.equalTo('frame', $scope.frames[i].attributes.frame);
//       query.limit(1);

//       query.find().then(function(data) {
//         $scope.frameImg[data[0].attributes.frame.id] = data[0].attributes.file._url;
//         $scope.$apply();
//         console.log(" + "+data[0].attributes.file._url);
//       }, function(error) {
//         console.log(error);
//       });













