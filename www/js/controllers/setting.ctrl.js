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

	});