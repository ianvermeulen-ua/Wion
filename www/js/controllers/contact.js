angular.module('roots.controllers')

.controller('ContactCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicScrollDelegate, $http, $ionicPopup, $ionicLoading) {

	$scope.contact = {};

	$scope.sendEmail = function(form) {

		if(form.$valid) {

			$ionicLoading.show({
				template: 'Sending...'
			});

			$http({
				method  : 'POST',
				url     : 'http://wikings.be/send-email.php',
				data    : {
					name: $scope.contact.name,
					email: $scope.contact.email,
					phone: $scope.contact.phone,
					message: $scope.contact.message
				},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        // pass in data as strings
				headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}  // set the headers so angular passing info as form data (not request payload)
			}).success(function(data) {

				$scope.contact = {};

				$ionicLoading.hide();

				$ionicPopup.alert({
					title: 'Success',
					template: 'Bericht verzonden.'
				});

			}).error(function(data){

				$ionicLoading.hide();

				$ionicPopup.alert({
					title: 'Error',
					template: "Er is een fout opgetreden bij het versturen."
				});

			});

		} else {
			$ionicLoading.hide();

			$ionicPopup.alert({
				title: 'Error',
				template: "Gelieve alle velden in te vulden."
			});
		}

    };

});
