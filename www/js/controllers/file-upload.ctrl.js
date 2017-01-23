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
    '$ionicModal',
    '$cordovaFile',
    '$cordovaMedia',
    '$ionicNavBarDelegate',
    '$q',
    function(
        $state,
        $scope,
        $rootScope,
        $ionicPopup,
        UserService,
        StorageService,
        PictureService,
        $ionicPopup,
        $ionicHistory,
        $ionicModal,
        $cordovaFile,
        $cordovaMedia,
        $ionicNavBarDelegate,
        $q) { 

        $ionicNavBarDelegate.showBackButton(false);

        // image upload
        /////////////////
        $scope.uploadCount = 0;

        $scope.images = [];
        $scope.recordingData;

        $scope.loadingState = false;
        $scope.uploadStarted = false;

        $scope.loading = function(state) {
            this.loadingState = state;
            // this.$apply();
        }

        $scope.cancel = function() {

            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            $state.go("app.playlists");

            $scope.images = [];
            $scope.uploadCount = 0;
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
                defer.resolve(file);
            }, function(error) {
                console.error(error);
                defer.reject(error);
            });

            return defer.promise;

        };

        $scope.upload = function() {
            console.warn("empty");
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
        ///////////
        // image upload


        /* microphone module */

        // recording modal
        $ionicModal.fromTemplateUrl('templates/record-msg-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openRecordModal = function() {

            //TODO: Investigate 
            // PictureService.clearFileCache(); //REMOVE THIS BEFORE FLIGHT!!!!

            $scope.modal.show();
        };
        $scope.closeRecordModal = function() {
            $scope.modal.hide();
        };
        // recording modal


        var mediaRec;

        //timer
        var timer;
        $scope.time = 0;
        $scope.recording = false;
        $scope.recordingExists = false;

        $scope.startTimer = function() {

            if (angular.isDefined(timer)) return;
            $scope.time = 0;
            $scope.recordingExists = false;

            PictureService.clearFileCache(); //REMOVE THIS BEFORE FLIGHT!!!!

            PictureService.prepDir().then(function(success) {
                PictureService.deleteRecording("recording.wav").then(function(success) {

                    mediaRec = new Media("recording.wav", ///var/mobile/Applications/<UUID>/tmp/myrecording.wav
                        function() {
                            console.log("recordAudio():Audio Success");
                        },
                        function(err) {
                            $rootScope.alert('系统出错', '无法录音!');
                        });

                    mediaRec.startRecord();
                    $scope.timeDisp = Math.floor($scope.time / 1000 / 60) + ':' + pad(Math.floor($scope.time / 1000 % 60), 2);

                    timer = setInterval(function() {
                        $scope.recording = true;
                        $scope.time += 100;
                        $scope.timeDisp = Math.floor($scope.time / 1000 / 60) + ':' + pad(Math.floor($scope.time / 1000 % 60), 2);
                        $scope.$apply();
                    }, 100);

                }, function(error) {
                    $rootScope.alert('系统出错', '无法录音!');
                });
            });
        };

        $scope.stopTimer = function() {
            if (angular.isDefined(timer)) {
                mediaRec.stopRecord();

                $scope.timeDisp = '';
                clearInterval(timer);
                $scope.recording = false;
                $scope.recordingExists = true;
                timer = undefined;
                $scope.$apply();

                // new
                if (ionic.Platform.isIOS()) {
                    var path = cordova.file.tempDirectory;
                } else if (ionic.Platform.isAndroid()) {
                    var path = cordova.file.externalRootDirectory;
                }

                var filename = "recording.wav";

                $cordovaFile.readAsDataURL(path, filename)
                    .then(function(data) {
                        var clean64 = /^data:audio\/.*;base64,/;

                        data = data.split(',')[1];

                        $scope.recordingData = data;
                    });
            }
        };

        $scope.playRecording = function() {
            mediaRec.play();
        }

        var pad = function(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        };

        function uploadRecordingFile() {

            var defer = $q.defer();

            if (!$scope.recordingExists) {
                defer.resolve(null);
                return defer.promise;
            };

            var data = $scope.recordingData;

            var file = new AV.File('recording.wav', {
                base64: data
            });
            file.save().then(function(obj) {
                defer.resolve(obj);

            }, function(err) {
                $rootScope.alert("系统出错", "无法保存录音!");
                defer.reject(err);
            });

            return defer.promise;
        }
        
        /* microphone module end */

        /* frame select modal */

        $ionicModal.fromTemplateUrl('templates/frame-select-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.frameModal = modal;
        });
        $scope.openFrameModal = function() {
            if (this.images.length == 0) {
                $rootScope.alert("大象框", "请选择相片");
            } else {
                $scope.frames = StorageService.getAll();

                for (var i = 0; i < $scope.frames.length; i++) {
                    $scope.frames[i].checked = false;
                }
                $scope.frameModal.show();
            }
        };
        $scope.closeFrameModal = function() {
            $scope.frameModal.hide();
        };
        //modal end

        //prep

        //prep

        $scope.frameSelected = function() {
            var nonSelected = true;

            for (var i = 0; i < $scope.frames.length; i++) {
                if ($scope.frames[i].checked == true) {
                    nonSelected = false;
                    break;
                }
            }

            if (nonSelected) {
                $ionicPopup.show({

                    title: '没选相框?',
                    subTitle: '请选择至少一个相框上传',
                    buttons: [{
                        text: 'Ok',
                        type: 'button-energized'
                    }, ]
                });
            } else {
                this.closeFrameModal();

                $scope.send();
            }
        }

        /* frame select modal end */

        /* send module */
        $scope.send = function() {
            this.loading(true);
            this.uploadStarted = true;
            this.$apply();
            var promises = [];

            for (var i = 0; i < this.images.length; i++) {
                promises.push(this.save_img_cloud(this.images[i], this.images[i].id));
            }

            $q.all(promises).then(function(files) {
                console.log(files);
                uploadRecordingFile().then(function(rec) {
                    fileOfFrameEntry(files, rec);
                }, function(err) {
                    fileOfFrameEntry(files, null);
                });
                this.loading(false);
                this.$apply();
                $rootScope.alert('大象框', '图片上传成功!');
                this.cancel();
            }.bind(this)).catch(function(ex) {
                this.loading(false);
                this.$apply();
                $rootScope.alert('大象框', '图片上传失败!');
            }.bind(this));

        }

        function fileOfFrameEntry(files, rec) {
            var promises = [];

            console.log("FOF Entry");

            for (var i = 0; i < $scope.frames.length; i++) {
                if ($scope.frames[i].checked) {
                    var frameId = $scope.frames[i].frame.id;

                    for (var j = 0; j < files.length; j++) {
                        promises.push(saveFileOfFrameItem(frameId, files[j], rec));
                    }
                }
            }

            $q.all(promises).then(function(files) {
                //NICE!
                console.log("END");

            }).catch(function(error) {
                console.log("FOF batch err: " + error);
            });

        }

        function saveFileOfFrameItem(frameId, file, rec) {
            var defer = $q.defer();

            var FOF = AV.Object.extend('FileOfFrame');
            var fof = new FOF();
            var frame = AV.Object.createWithoutData('Frame', frameId);
            fof.set('frame', frame);
            fof.set('sender', AV.User.current());
            fof.set('file', file);
            if (rec != null) {
                fof.set('record', rec);
            }
            fof.save().then(function(fof) {
                console.log('New FOF created with objectId: ' + fof.id);
                defer.resolve(fof.id);
            }, function(err) {
                $rootScope.alert("系统出错", "无法保存云图片!");
                console.log('Failed to create new FOF, with error message: ' + err.message);
                defer.reject();
            });

            return defer.promise;
        }
        /* send module end */
    }
]);
