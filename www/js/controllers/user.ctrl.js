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
					$state.go('app.intro');

				}, function(error) {
					$rootScope.hide();
					console.log("login err + " + error);
					$ionicPopup.confirm({
						title: 'Oops!',
						template: error.avosErr.message
					});
				})
		};

	}
])

.controller('SignUpController', [
	'$state',
	'$scope',
	'$rootScope',
	function($state, $scope, $rootScope) {

		function checkPhone(phone) {
			if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone+''))) {
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

		$scope.requestsms = function(reset) {
			if (checkPhone($scope.info.phonenumber)) {
				if (!reset) {
					AV.Cloud.requestSmsCode($scope.info.phonenumber + '').then(function(success) {
						alert('注册验证码发送成功');
						sentWait();

					}, function(error) {
						alert(error.message);
					});
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
			AV.User.resetPasswordBySmsCode($scope.info.smscode+'', $scope.info.password).then(function(success) {
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
			if (!checkPhone($scope.info.phonenumber)) {
				return false;
			}

			var user = new AV.User(); // 新建 AVUser 对象实例
			user.setPassword($scope.info.password); // 设置密码
			user.setMobilePhoneNumber($scope.info.phonenumber + '');

			AV.User.verifyMobilePhone($scope.info.smscode + '').then(function() {
				user.signUp().then(function(loginedUser) {
					console.log(loginedUser);
					alert('成功');
					$state.go('app-login');
				}, (function(error) {}));
			}, function(err) {
				alert('用户创建失败!');
			});

		}
	}
])

;