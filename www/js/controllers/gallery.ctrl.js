angular.module('gallery.controllers', [])

.controller('GalleryController', function($scope, $rootScope, $state, $stateParams, StorageService, $ionicModal, $ionicScrollDelegate) {

  $scope.images = [];

  $scope.frame = StorageService.get($stateParams.playlistId);
  debugger;

  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/image-popover.html');
  }

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  // Close the modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };

  $scope.skip = 0;

  $scope.loadImages = function() {
  	$rootScope.show();
    var query = new AV.Query('FileOfFrame');
    query.addDescending('createdAt');
    query.include('_File');

    var frame = AV.Object.createWithoutData('frame', $stateParams.playlistId);

    query.equalTo('frame', frame);
    // query.skip($scope.skip);
    // query.limit(30);
    query.find().then(function(pictures) {
      console.log(pictures.length);
      $rootScope.hide();
      for (var i = 0; i < pictures.length; i++) {
        console.log(pictures[i].id + ' ' + i);
        var file = pictures[i].get('file');
        var url = file.thumbnailURL(150, 150, 30);
        var full = file.thumbnailURL(500, 500, 100);
        $scope.images.push({
          id: i,
          src: url,
          full: full
        });
        $scope.$apply();
      }
      debugger;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.skip += 30;
      console.log($scope.skip);

    }, function(error) {
      console.log(error);
    });
  }
  $scope.loadImages();

  $scope.imageWidth = window.innerWidth / 4 + 'px';

  debugger;
  console.log($stateParams.playlistId);

});