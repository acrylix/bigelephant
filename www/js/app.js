// Ionic Starter App
AV.init({
  appId: 'g3MhlGPMjeDFBDn3d27Ho3Aw-gzGzoHsz', 
  appKey: 'zeb5uU59kMmSpSkJPJybzxRm'
});
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'underscore',
  'ngStorage',
  'ngCordova',
  'starter.controllers',
  'user.controllers',
  'intro.controllers',
  'test.controllers',
  'album.controllers',
  'gallery.controllers',
  'setting.controllers',
  'camera.controllers',
  'upload.controllers',
  'file-upload.controllers',
  'album-cloud.controllers',
  'user.services',
  'frame.services',
  'picture.services'
])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);

    $stateProvider

    //***Sign Up***
      .state('app-login', {
        url: "/login",
        templateUrl: "templates/start/login.html",
        controller: "LogInController"
      })
      .state('app-signup', {
        url: "/signup",
        templateUrl: "templates/start/signup.html",
        controller: "SignUpController"
      })
      .state('app-forgot', {
        url: "/forgot",
        templateUrl: "templates/start/forgot.html",
        controller: "SignUpController"
      })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      resolve: {
        user: function(UserService) {
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
      .state('app.intro', {
        url: '/intro',
        views: {
          'menuContent': {
            templateUrl: 'templates/intro.html',
            controller: 'IntroController'
          }
        }
      })
      .state('app.noFrame', {
        url: '/noFrame',
        views: {
          'menuContent': {
            templateUrl: 'templates/noFramePage.html',
            controller: 'AlbumController'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'AlbumController'
          }
        }
      })
      .state('app.album', {
        url: '/album',
        views: {
          'menuContent': {
            templateUrl: 'templates/album-cloud.html',
            controller: 'CloudAlbumController'
          }
        }
      })
      .state('app.smartGallery', {
        url: '/smartGallery/:key',
        views: {
          'menuContent': {
            templateUrl: 'templates/smart-gallery.html',
            controller: 'SmartSearchController'
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

    .state('app.test', {
        url: '/test',
        views: {
          'menuContent': {
            templateUrl: 'templates/test-page.html',
            controller: 'TestController'
          }
        }
      })
    .state('app.upload', {
        url: '/upload',
        views: {
          'menuContent': {
            templateUrl: 'templates/pictureUpload/upload.html',
            controller: 'FileUploadController'
          }
        }
      })
      .state('app.setting', {
        url: '/setting',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingController'
          }
        }
      })
      .state('app.manualAddFrame', {
        url: '/manualadd',
        views: {
          'menuContent': {
            templateUrl: 'templates/manualAddFrame.html',
            controller: 'AlbumController'
          }
        }
      })
      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'GalleryController'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/playlists');
  })
  .run(function($ionicPlatform, $rootScope, $state, $ionicLoading, $ionicPopup) {

    // loading helpers
    $rootScope.show = function() {
      $ionicLoading.show({
        content: 'dots',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };
    $rootScope.hide = function() {
      $ionicLoading.hide();
    };
    $rootScope.alert = function(title, text) {
        var alertBox = function() {
          var alertPopup = $ionicPopup.alert({
            title: title,
            template: text,
            buttons: [{
              text: '<b>OK</b>',
              type: 'button-energized'
            }]
          });
        }();
      }
      //catch error routes
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {

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