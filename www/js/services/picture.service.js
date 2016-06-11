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

        $cordovaFile.checkDir(cordova.file.dataDirectory, "ElephantPics")
          .then(function(success) {
            defer.resolve(success);
          }, function(error) {
            defer.reject(error);
          });

        return defer.promise;
      }

      var createDir = function() {

        var defer = $q.defer();
        $cordovaFile.createDir(cordova.file.dataDirectory, "ElephantPics", false)
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
        $cordovaFile.copyFile(cordova.file.tempDirectory, tempFileName, cordova.file.dataDirectory, "ElephantPics/" + tempFileName)
          .then(function(success) {
            // success
          }, function(error) {
            // error
            alert("failed");
          });
      }

      var clearPicCacheDir = function() {
        var defer = $q.defer();
        $cordovaFile.removeRecursively(cordova.file.dataDirectory, "ElephantPics") //Dangerous
          .then(function(success) {
            // success
            defer.resolve(success);

          }, function(error) {
            // error
            defer.reject(error);
            console.log('clear dir failed: already empty its ok');
          });

        return defer.promise;
      }

      var prepDir = function() {
        _clear();
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
        pictures: [],
        recordings: []
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
      var _getRecording = function(){
        return $localStorage.recordings[0];
      }



      var copyImgToMem = function(tempFileName) {

        $cordovaFile.copyFile(cordova.file.tempDirectory, tempFileName, cordova.file.dataDirectory, "ElephantPics/" + tempFileName)
          .then(function(success) {
            // success
            _add(cordova.file.dataDirectory + "ElephantPics/" + tempFileName);

          }, function(error) {
            // error
            alert("mem copy failed");
          });

      }

      var copyRecordingToMem = function(recordingFileName) {

        $cordovaFile.copyFile(cordova.file.tempDirectory, recordingFileName, cordova.file.dataDirectory, "ElephantPics/" + recordingFileName)
          .then(function(success) {
            // success
            $localStorage.recordings.push(cordova.file.dataDirectory + "ElephantPics/" + recordingFileName);
            console.log('recording copied to perm location');
          }, function(error) {
            // error
            alert("rec mem copy failed");
          });

      }

      var deleteRecording = function(recordingFileName) {
        var defer = $q.defer();

        $cordovaFile.removeFile(cordova.file.dataDirectory + "ElephantPics/", recordingFileName)
          .then(function(success) {
            // success

            $cordovaFile.removeFile(cordova.file.tempDirectory, recordingFileName)
              .then(function(success) {
                // success
                $localStorage.recordings = [];
                defer.resolve();
              }, function(error) {
                // error
                console.log('delete temp recording failed');
                defer.resolve();
              });

          }, function(error) {
            // error
            console.log('delete perm recording failed');
            defer.resolve();
          });

        return defer.promise;
      }

      return {
        getAll: _getAll,
        add: _add,
        remove: _remove,
        isEmpty: _isEmpty,
        clear: _clear,
        prepDir: prepDir,
        clearFileCache: clearPicCacheDir,
        copyToMem: copyImgToMem,

        copyRecordingToMem: copyRecordingToMem,
        deleteRecording: deleteRecording,
        getRecordingUri: _getRecording
      };
    }
  ]);