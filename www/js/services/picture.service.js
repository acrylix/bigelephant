angular.module('picture.services', ['ngStorage'])
  // create a new factory
  .factory('PictureService', [
    '$q',
    '$localStorage',
    '$cordovaFile',
    function($q, $localStorage, $cordovaFile) {

      var _space = function() {
        $cordovaFile.getFreeDiskSpace()
          .then(function(success) {
            return success;
          }, function(error) {
            return null;
          });

      }

      var checkDir = function() {
        var defer = $q.defer();

        $cordovaFile.checkDir(cordova.file.documentsDirectory, "ElephantPics")
          .then(function(success) {
            defer.resolve(success);
          }, function(error) {
            defer.reject(error);
          });

        return defer.promise;
      }

      var createDir = function() {

        var defer = $q.defer();
        $cordovaFile.createDir(cordova.file.documentsDirectory, "ElephantPics", false)
          .then(function(success) {
            // success
            defer.resolve(success);
          }, function(error) {
            // error
            defer.reject(error);
          });

        return defer.promise;
      }

      var copyImg = function(tempFileName) { //with extension
        $cordovaFile.copyFile(cordova.file.tempDirectory, tempFileName, cordova.file.documentsDirectory, "ElephantPics/" + tempFileName)
          .then(function(success) {
            // success
          }, function(error) {
            // error
            alert("failed");
          });
      }

      var clearPicCacheDir = function() {
        var defer = $q.defer();
        $cordovaFile.removeRecursively(cordova.file.documentsDirectory, "ElephantPics") //Dangerous
          .then(function(success) {
            // success
            defer.resolve(success);

          }, function(error) {
            // error
            defer.reject(error);
            alert('cache clear failed');
          });

        return defer.promise;
      }

      var prepDir = function() {
        var defer = $q.defer();

        checkDir().then(function(result) {
          debugger;
          //copyImg
          defer.resolve(result);
        }, function(error) {
          debugger;
          if (error.message == 'NOT_FOUND_ERR') {
            createDir().then(function(result) {
              //copyImg
              debugger;
              defer.resolve(result);
            }, function(error) {
              debugger;
              defer.resolve(error);
            });
          }
        });

        return defer.promise;

      }

      //get setters

      $localStorage = $localStorage.$default({
        pictures: []
      });

      var _getAll = function() {
        return $localStorage.pictures;
      };
      var _clear = function() {
        $localStorage.pictures = [];
      }
      var _isEmpty = function() {
        return $localStorage.pictures.length == 0;
      }
      var _add = function(imageUri) {
        $localStorage.pictures.push(imageUri);
      }
      var _remove = function(frame) {
        $localStorage.pictures.splice($localStorage.things.indexOf(thing), 1);
      }



      var copyImgToMem = function(tempFileName) {
        prepDir().then(function(success) {

          $cordovaFile.copyFile(cordova.file.tempDirectory, tempFileName, cordova.file.documentsDirectory, "ElephantPics/" + tempFileName)
            .then(function(success) {
              // success
              _clear();
              _add(cordova.file.documentsDirectory + "ElephantPics/" + tempFileName);

            }, function(error) {
              // error
              alert("failed");
            });

        });
      }

      return {
        getAll: _getAll,
        add: _add,
        remove: _remove,
        isEmpty: _isEmpty,
        clear: _clear,
        space: prepDir,
        clearFileCache: clearPicCacheDir,
        copyToMem: copyImgToMem
      };
    }
  ]);