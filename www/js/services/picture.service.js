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
        recordings: [],
        tempImg: []
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
      var _getRecording = function() {
        return $localStorage.recordings[0];
      }
      var _addTmpImage = function(data){
        $localStorage.tempImg = [];
        $localStorage.tempImg.push(data);
      }
      var _getTmpImage = function(){
        return $localStorage.tempImg[0];
      }
      var _clearTmpImageSpace = function(){
        $localStorage.tempImg = [];
      }



      var copyImgToMem = function(filepath) {

        var filename = filepath.replace(/^.*[\\\/]/, '');
        var path = filepath.replace(/[^\/]*$/, '');

        if (ionic.Platform.isIOS()) {

          $cordovaFile.copyFile(path, filename, cordova.file.dataDirectory + "ElephantPics/", filename)
            .then(function(success) {
              // success
              _add(cordova.file.dataDirectory + "ElephantPics/" + filename);

            }, function(error) {
              // error
              alert("mem copy failed");
            });
        }

        if (ionic.Platform.isAndroid()) { //file:///storage/emulated/0/Android/data/com.ionicframework.bigelephant305082/cache/1465787348653.jpg
          _add(filepath);
        }

      }

      var copyRecordingToMem = function(recordingFileName) { //change path handler
        if (ionic.Platform.isIOS()) {

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
        if (ionic.Platform.isAndroid()) {

          $cordovaFile.copyFile("file:///storage/emulated/0/", recordingFileName, cordova.file.externalDataDirectory, recordingFileName)
            .then(function(success) {
              // success
              $localStorage.recordings.push(cordova.file.externalDataDirectory + recordingFileName);
              console.log('recording copied to perm location');
            }, function(error) {
              // error
              alert("rec mem copy failed android");
            });

        }

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
        getRecordingUri: _getRecording,

        addTmpImg: _addTmpImage,
        getTmpImg: _getTmpImage,
        clearTmpImg: _clearTmpImageSpace
      };
    }
  ]);