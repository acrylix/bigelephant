// Ionic Starter App
AV.initialize('g3MhlGPMjeDFBDn3d27Ho3Aw-gzGzoHsz', 'zeb5uU59kMmSpSkJPJybzxRm');
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic', 
    'ngStorage',
    'ngCordova',
    'ionic-cache-src',
    'starter.controllers',
    'user.controllers',
    'camera.controllers',
    'upload.controllers',
    'user.services',
    'frame.services',
    'picture.services'
    ]
  )

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  //***Sign Up***
  .state('app-login', {
      url: "/login",
      templateUrl: "templates/start/login.html",
      controller: "LogInController"
  })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    resolve: {
        user: function (UserService) {
            var value = UserService.init();
            return value;
        }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.selectFrame', {
      url: '/selectFrame',
      views: {
        'menuContent': {
          templateUrl: 'templates/pictureUpload/selectFrame.html',
          controller: 'FrameSelectController'
        }
      }
    })
    .state('app.camera', {
      url: '/camera',
      views: {
        'menuContent': {
          templateUrl: 'templates/camera.html',
          controller: 'CameraCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
})
.run(function($ionicPlatform, $rootScope, $state, $ionicLoading) {

  // loading helpers
  $rootScope.show = function() {
    $ionicLoading.show({
          content: 'ripple',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
     });
  };
  $rootScope.hide = function(){
    $ionicLoading.hide();
  };   

  //catch error routes
  $rootScope.$on('$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {

        console.log('$stateChangeError ' + error && (error.debug || error.message || error));

        // if the error is "noUser" the go to login state
        if (error && error.error === "noUser") {
            event.preventDefault();

            $state.go('app-login', {});
        }
    });
  
  //device settings
  $ionicPlatform.ready(function() {
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
