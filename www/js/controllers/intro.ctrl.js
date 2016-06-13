angular.module('intro.controllers', ['ionic'])
	.controller('IntroController', function(
		$scope,
		$state,
		$ionicHistory,
		$ionicSlideBoxDelegate,
		$ionicSideMenuDelegate) {

		$ionicSideMenuDelegate.canDragContent(false);

		$scope.slideChanged = function(index) {
			$scope.slideIndex = index;
		};

		$scope.go = function(){
			$ionicHistory.nextViewOptions({
				disableBack: true
			});

			$state.go("app.playlists");
		}

	});