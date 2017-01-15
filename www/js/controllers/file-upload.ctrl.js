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

        // $scope.images = [];
        $scope.images = [];


        $scope.cancel = function() {
            $state.go('app.playlists');
        }

        $scope.save_img_cloud = function(img, id) {
            var defer = $q.defer();

            var blob = img.data;
            var clean64 = /^data:image\/.*;base64,/;

            var base64result = blob.split(',')[1];

            var d = new Date();
            var n = d.getTime();

            var file = new AV.File('pic' + n + '.jpg', { base64: base64result });
            // console.log(n);

            var img = _.findWhere(this.images, { id: id });
            img.uploading = true;
            console.log(img);

            var onProg = function(id, e) {
                var scope = angular.element(document.querySelector("#picture_selection_page")).scope();
                var img = _.findWhere(scope.images, { id: id });


                img.progress = Math.round(e.percent);

                scope.$apply();
                console.log(e);
            }

            file.save({
                onprogress: onProg.bind(null, id)
            }, {}).then(function(file) {
                // 文件保存成功
                console.warn("success");
                // console.log();
                defer.resolve(file.url());
            }, function(error) {
                // 异常处理
                console.error(error);
                defer.reject(error);
            });

            return defer.promise;

        }

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
            })




        }

        var async_load = function(file) {
            var defer = $q.defer();

            var reader = new FileReader();

            reader.onload = function(e) {

                var src = e.target.result;

                var scope = angular.element(document.querySelector("#picture_selection_page")).scope();

                var id = scope.images.length + 1;

                // var elem = angular.element(document.querySelector('#uploaderFiles'));
                // var img_template = '<li id="pic'+id+'" class="weui-uploader__file weui-uploader__file_status" style="background-image:url(#url#)"><div class="weui-uploader__file-content">50%</div></li>'

                // elem.append(img_template.replace('#url#', src));

                defer.resolve(src);

                var img = {
                    id: id,
                    progress: 0,
                    data: src
                }

                scope.images.push(img);
            };
            reader.readAsDataURL(file);
            return defer.promise;
        }

        $scope.previewFile = function(files) {

            this.uploadCount += files.length;
            this.$apply();

            for (var i = 0, len = files.length; i < len; ++i) {
                var file = files[i];

                async_load(file).then(function(result) {
                    console.log("#image blob added to model");
                })

            }

        }

    }
]);
