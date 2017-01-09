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

        $scope.uploadCount = 0;

        $scope.cancel = function() {
            $state.go('app.playlists');
        }

        $scope.upload = function() {
            var clean64 = /^data:image\/.*;base64,/;

            var data = this.image.src;
            var base64result = data.split(',')[1];

            var file = new AV.File("test.jpg", { base64: base64result });
            file.save({
                onprogress: function(e) { console.log(e); }
            }, {}).then(function(file) {
                // 文件保存成功
                alert("success");
                console.log(file.url());
            }, function(error) {
                // 异常处理
                console.error(error);
            });


        }

        $scope.previewFile = function(files) {

            this.uploadCount = files.length;
            this.$apply();

            for (var i = 0, len = files.length; i < len; ++i) {
                var file = files[i];

                var reader = new FileReader();

                reader.onload = function(e) {
                    // console.log(e.target.result);

                    var src = e.target.result;

                    var elem = angular.element(document.querySelector('#uploaderFiles'));
                    var img_template = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>'

                    elem.append(img_template.replace('#url#', src));

                };
                reader.readAsDataURL(file);

            }

        }

    }
]);
