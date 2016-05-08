angular.module('starter.controllers', ['ngCordova'])
  .directive('backImg', function() {
    return function(scope, element, attrs) {
      var url = attrs.backImg;
      var content = element.find('a');

      content.css({
        'box-shadow': 'rgba(0, 0, 0, 0.4) 0px -79px 55px -26px inset',
        'z-index': '100',
        'color': 'white'
      });
    }
  })

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, UserService) {

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

  $scope.logout = function(){
    UserService.logout().then(function(done){
      $state.go('app-login');
    }, function(error){
      $state.go('app-login');
    })
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





