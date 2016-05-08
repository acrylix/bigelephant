angular.module('gallery.controllers', [])
  .directive('imageonload', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('load', function() {
          $rootScope.hide();
        });
        element.bind('error', function() {
          $rootScope.hide();
          alert('image load failed');
        });
      }
    };
  })

.controller('SmartSearchController', function($scope, $rootScope, $http, $q, $state, $stateParams, StorageService, $ionicModal, $ionicScrollDelegate) {

  $scope.images = [];
  $scope.keyword = $stateParams.key;

  $scope.frame = StorageService.get($stateParams.playlistId);
  debugger;

  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.img = $scope.images[index];
    $rootScope.show();
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

  var getImg = function(PhotoTagId, index) {
    var defer = $q.defer();

    var query = new AV.Query('PhotoTag');

    query.equalTo('objectId', PhotoTagId);
    query.include('fileOfFrame');
    query.first().then(function(data) {
      debugger;
      var file = data.attributes.fileOfFrame.attributes.file;
        var url = file.thumbnailURL(150, 150, 30);
        var full = file.thumbnailURL(1000, 1000, 10);
        $scope.images.push({
          id: index,
          src: url,
          full: full
        });
        //$scope.$apply();
        defer.resolve();

    }, function(error) {
      console.log(error);
      defer.reject();
    });
    return defer.promise;

  }

  $scope.loadImages = function() {
    $rootScope.show();

    myobject = {
      key: $stateParams.key,
      userid: AV.User.current().id
    };
    Object.toparams = function ObjecttoParams(obj) {
      var p = [];
      for (var key in obj) {
        p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    };
    var req = {
      method: 'POST',
      url: "http://hidden-lowlands-82344.herokuapp.com/api/search",
      data: Object.toparams(myobject),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    $http(req)
    .success(function(data, status, headers, config) {
      //success
      debugger;
      $rootScope.hide();
      console.log(data);

      var promises = [];

      for (var i = 0; i < data.length; i++) {
        promises.push(getImg(data[i],i));
      }

      $q.all(promises).then(function(files) {
         //NICE!
         console.log("displaying smart search results");

       });

    })
    .error(function(data, status, headers, config) {
      //error
      $rootScope.hide();
      console.log('smart search ERROR');
    });

  }
  $scope.loadImages();

  $scope.imageWidth = window.innerWidth / 4 + 'px';

})

.controller('GalleryController', function($scope, $rootScope, $state, $stateParams, StorageService, $ionicModal, $ionicScrollDelegate) {

  $scope.images = [];

  $scope.frame = StorageService.get($stateParams.playlistId);
  debugger;

  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.img = $scope.images[index];
    $rootScope.show();
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
    query.equalTo('sender', AV.User.current());
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
        var full = file.thumbnailURL(1000, 1000, 10);
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