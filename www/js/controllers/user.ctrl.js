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
		// 	password: "123qwe"
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
			if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
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

		$scope.requestsms = function() {
			if (checkPhone($scope.info.phonenumber)) {
				AV.Cloud.requestSmsCode($scope.info.phonenumber + '').then(function(success) {
					alert('验证码发送成功');

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
				}, function(error) {
					alert(error.message);
				});
			}
		}

		$scope.signup = function() {
			if ($scope.info.password != $scope.info.passwordcheck) {
				alert('密码不匹配');
				return false;
			}
			if (checkPhone($scope.info.phonenumber)) {
				return false;
			}

			var user = new AV.User(); // 新建 AVUser 对象实例
			user.setPassword($scope.info.password); // 设置密码
			user.setMobilePhoneNumber($scope.info.phonenumber);

			AV.User.verifyMobilePhone($scope.info.smscode).then(function() {
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