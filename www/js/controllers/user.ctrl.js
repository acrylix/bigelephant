angular.module('user.controllers', [])

.controller('LogInController', [
	'$state',
	'$scope',
	'$rootScope',
	'$ionicPopup',
	'UserService',
	function($state, $scope, $rootScope, $ionicPopup, UserService) {

		// $scope.creds = {
		// 	phonenumber: "18811713937",
		// 	password: "1234"
		// };

		$scope.creds = {
			phonenumber: "",
			password: ""
		};

		$scope.doLoginAction = function() {
			$rootScope.show();
			UserService.login($scope.creds.phonenumber, $scope.creds.password)
				.then(function(user) {
					$rootScope.hide();
					console.log(user);

					$state.go('app.playlists');

				}, function(error) {
					$rootScope.hide();
					console.log("login err + " + error);
					$ionicPopup.confirm({
						title: '无法登陆!',
						template: error.avosErr.message
					});
				})
		};

	}
])

.controller('SignUpController', [
	'$state',
	'$q',
	'$scope',
	'$rootScope',
	function($state, $q, $scope, $rootScope) {

		function checkPhone(phone) {
			if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone + ''))) {
				alert("手机号码格式有误，请重填");
				return false;
			}
			return true;
		}

		$scope.info = {
			phonenumber: '',
			password: '',
			passwordcheck: '',
			smscode: '',
		}

		$scope.verify = '获取验证码';

		var sentWait = function() {
			var time = 20;
			$scope.verify = '已发送 ' + time + 's';
			$scope.waiting = true;

			var timer = setInterval(function() {
				time--;
				$scope.verify = '已发送 ' + time + 's';

				$scope.$apply();
				if (time == 0) {
					clearInterval(timer);
					$scope.verify = '获取验证码';
					$scope.waiting = false;
					$scope.$apply();
				}
			}, 1000);
		}

		var userExists = function(phone) {

			var defered = $q.defer();

			var query = new AV.Query('_User');
			query.equalTo('mobilePhoneNumber', phone);
			query.find().then(function(results) {
				defered.resolve(results);
			}, function(error) {
				defered.resolve(error);
			})

			return defered.promise;
		}

		var newUserCreate = function(phone) {
			var defered = $q.defer();

			var randId = 'xxyxxxyxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});

			var user = new AV.User(); // 新建 AVUser 对象实例
			user.set("username", randId + '');
			user.set("userId", randId + '');
			user.set("password", $scope.info.password); // 设置密码
			user.setMobilePhoneNumber(phone + '');
			user.signUp(null, {
				success: function(user) {
					defered.resolve(user);
				},
				error: function(user, error) {
					console.warn("user create err: " + error.code + " " + error.message);
					defered.reject(error);
				}
			});

			return defered.promise;
		}

		$scope.newReg = function() {

			$scope.phone = $scope.info.phonenumber;
			$rootScope.show();
			userExists($scope.phone).then(function(success) {
				if (!success.length) {
					newUserCreate($scope.phone).then(function(success) {
						$rootScope.hide();
						alert('注册验证码发送成功');
						sentWait();

					}, function(error) {
						$rootScope.hide();
						if (error.code == -1) {
							alert("请填写和确认密码")
						} else {
							alert(error.message);
						}
					})
				} else {
					AV.User.requestMobilePhoneVerify($scope.phone + '').then(function(success) {
						$rootScope.hide();
						alert('注册验证码发送成功');
						sentWait();

					}, function(error) {
						$rootScope.hide();
						alert(error.message);
					});
				}
			});
		}

		$scope.requestsms = function(reset) {
			if (checkPhone($scope.info.phonenumber)) {
				if (!reset) {
					$scope.newReg();

				} else {
					AV.User.requestPasswordResetBySmsCode($scope.info.phonenumber + '').then(function(success) {
						alert('重置验证码发送成功');
						sentWait();

					}, function(error) {
						alert(error.message);
					});
				}
			}
		}

		$scope.resetPassword = function() {
			if ($scope.info.password != $scope.info.passwordcheck) {
				alert('密码不匹配');
				return false;
			}
			if ($scope.info.password == '') {
				alert('密码为空');
				return false;
			}
			if (!checkPhone($scope.info.phonenumber)) {
				return false;
			}
			AV.User.resetPasswordBySmsCode($scope.info.smscode + '', $scope.info.password).then(function(success) {
				alert('密码重置成功');
				$state.go('app-login');
			}, function(error) {
				alert(error.message);
			});
		}

		$scope.signup = function() {
			if ($scope.info.password != $scope.info.passwordcheck) {
				alert('密码不匹配');
				return false;
			}
			if ($scope.info.password == '') {
				alert('密码为空');
				return false;
			}
			if (!$scope.info.smscode) {
				alert('验证码为空');
				return false;
			}
			if (!checkPhone($scope.info.phonenumber)) {
				return false;
			}
			$rootScope.show();

			AV.User.verifyMobilePhone($scope.info.smscode).then(function(success) {
				//验证成功
				$rootScope.hide();
				alert("账号创建成功!");
				$state.go('app-login');
			}, function(err) {
				//验证失败
				$rootScope.hide();
				alert(err.message);
			});

		}
	}
])

;