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

        $scope.uploadCount = 0;

        $scope.images = [];

        $scope.loadingState = false;

        $scope.loading = function(state) {
            this.loadingState = state;
            // this.$apply();
        }

        $scope.cancel = function() {
            $state.go('app.playlists');
        };

        $scope.save_img_cloud = function(img, id) {
            var defer = $q.defer();

            // base64 process
            var blob = img.data;
            var clean64 = /^data:image\/.*;base64,/;
            var base64result = blob.split(',')[1];

            var d = new Date();
            var n = d.getTime();
            var file = new AV.File('pic' + n + '.jpg', { base64: base64result });


            var onProg = function(id, scope, e) {
                var img = _.findWhere(scope.images, { id: id });
                img.progress = Math.round(e.percent);

                scope.$apply();
            }

            file.save({
                onprogress: onProg.bind(null, id, this)
            }, {}).then(function(file) {
                console.log("img upload success");
                defer.resolve(file.url());
            }, function(error) {
                console.error(error);
                defer.reject(error);
            });

            return defer.promise;

        };

        $scope.upload = function() {
            var promises = [];

            for (var i = 0; i < this.images.length; i++) {
                promises.push(this.save_img_cloud(this.images[i], this.images[i].id));
            }

            $q.all(promises).then(function(files) {
                console.log(files);
                $rootScope.alert('大象框', '图片上传成功!');
            }).catch(function(ex) {
                console.error(ex);
            });
        };

        var custom_onload = function(scope, defer, e) {
            var src = e.target.result;
            var id = scope.images.length + 1;

            var img = {
                id: id,
                progress: 0,
                data: src
            }

            scope.images.push(img);
            defer.resolve(src);
        };

        $scope.async_load = function(file) {
            var defer = $q.defer();
            var reader = new FileReader();
            reader.onload = custom_onload.bind(null, this, defer);
            reader.readAsDataURL(file);
            return defer.promise;
        };

        $scope.previewFile = function(files) {

            this.uploadCount += files.length;
            this.loading(true);

            var promises = [];


            for (var i = 0, len = files.length; i < len; ++i) {
                var file = files[i];
                promises.push(this.async_load(file));
            }

            $q.all(promises).then(function(images) {
                this.loading(false);
            }.bind(this));

        };
    }
]);
