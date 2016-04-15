angular.module('starter.controllers', [])
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

.controller('PlaylistsCtrl', function($scope, $ionicActionSheet) {

$scope.shouldShowDelete = false;
 $scope.shouldShowReorder = false;
 $scope.listCanSwipe = true;

 $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };

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

  var query = new AV.Query('MapUserFrame');
  query.include('frame');
  query.equalTo('user', AV.User.current());
  query.find().then(function(results) {
    console.log('Successfully retrieved ' + results.length + ' posts.');
    // 处理返回的结果数据
    $scope.frames = results;
    $scope.$apply();
    // for (var i = 0; i < results.length; i++) {
    //   var object = results[i];
    //   console.log(object.id + ' - ' + object.get('content'));
    // }
  }, function(error) {
    console.log('Error: ' + error.code + ' ' + error.message);
  });
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
