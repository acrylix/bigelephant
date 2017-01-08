angular.module('file-upload.controllers', ['ngImageInputWithPreview'])

.controller('FileUploadController', [
    '$state',
    '$scope',
    '$rootScope',
    '$ionicPopup',
    'UserService',
    'StorageService',
    'PictureService',
    '$ionicPopup',
    '$ionicHistory',
    '$ionicNavBarDelegate',
    '$q',
    function($state, $scope, $rootScope, $ionicPopup, UserService, StorageService, PictureService, $ionicPopup, $ionicHistory, $ionicNavBarDelegate, $q) { 
        $ionicNavBarDelegate.showBackButton(false);

        $scope.cancel = function() {
            $state.go('app.playlists');
        }



        $scope.previewFile = function(files) {
            var preview = document.querySelector('img');
            // var file = document.querySelector('input[type=file]').files[0];
            var file = files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
            	console.log(e.target.result);
                preview.src = e.target.result;
            };

            if (file) {
                console.log(reader.readAsDataURL(file));

                // var file = new AV.File(file.name, file);
                // file.save({
                //     onprogress: function(e) { console.log(e); }
                // }, {}).then(function(file) {
                //     // 文件保存成功
                //     console.log(file.url());
                // }, function(error) {
                //     // 异常处理
                //     console.error(error);
                // });
            }
        }

    }
]);
