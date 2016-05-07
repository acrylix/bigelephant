angular.module('frame.services', ['ngStorage'])
// create a new factory
.factory ('StorageService', function ($localStorage) {

  $localStorage = $localStorage.$default({
    frames: []
  });

  var _getAll = function () {
    return $localStorage.frames;
  };
  var _clear = function(){
    $localStorage.frames = [];
  }
  var _isEmpty = function(){
    return $localStorage.frames.length == 0;
  }
  var _add = function (frame) {
    $localStorage.frames.push(frame);
  }
  var _remove = function (frame) {
    $localStorage.frames.splice($localStorage.things.indexOf(thing), 1);
  }
  var _addLatestImg = function(frameId, url){
    for (var i = 0; i < $localStorage.frames.length; i++) {
        if ($localStorage.frames[i].frame.id === frameId) {
          $localStorage.frames[i].latestImg = url;
          break;
        }
      }
  }
  var _get = function (frameId){
      for (var i = 0; i < $localStorage.frames.length; i++) {
        if ($localStorage.frames[i].frame.id === frameId) {
          return $localStorage.frames[i];
        }
      }
      return null;
  } 
  return {
      getAll: _getAll,
      add: _add,
      remove: _remove,
      get: _get,
      isEmpty: _isEmpty,
      clear: _clear, 
      addLatestImg: _addLatestImg
    };
})
;
