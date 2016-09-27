angular.module('setting.controllers', ['ionic'])
	.controller('SettingController', function(
		$scope,
		$state,
		$rootScope,
		$q,
		$cordovaFile,
		$rootScope,
		$cordovaMedia,
		PictureService,
		$ionicHistory,
		$ionicPopup,
		$ionicModal,
		$cordovaFile) {

		$scope.initialText = 'This is an expanding textarea.  Type something and see...';

		$ionicModal.fromTemplateUrl('templates/about.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.openModal = function() {
			$scope.modal.show();
		};
		$scope.closeModal = function() {
			$scope.modal.hide();
		};
		// Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});

		$ionicModal.fromTemplateUrl('templates/feedback.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.feedback = modal;
		});
		$scope.openFeedback = function() {
			$scope.feedback.show();
		};
		$scope.closeFeedback = function() {
			$scope.feedback.hide();
		};
		// Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function() {
			$scope.feedback.remove();
		});

		$scope.feedbackInfo = {
			type: "功能",
			content: ""
		};
		//send feedback
		$scope.sendFeedback = function() {
			if ($scope.feedbackInfo.content == "") {
				alert("请填写反馈内容");
			} else {
				$rootScope.show();
				var Feedback = AV.Object.extend('AppFeedback');
				var feedback = new Feedback();
				feedback.set('user', AV.User.current());
				feedback.set('content', $scope.feedbackInfo.content);
				feedback.set('type', $scope.feedbackInfo.type);
				feedback.save().then(function(todo) {
					console.log('New app feedback created with objectId: ' + todo.id);
					$rootScope.hide();
					alert("发送成功");
				}, function(error) {
					console.log('Failed to create new app feedback, with error message: ' + error.message);
					$rootScope.hide();
					alert("发送失败, 请检查网络");
				});
			}
		}

	});