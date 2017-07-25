angular.module('roots.controllers')

.controller('AuthCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicModal, $ionicPopup, $ionicLoading, $location, User) {

	$scope.modalTitle = 'Login';
	$scope.forgotMode = false;

	$scope.loginData = {};
	$scope.signupData = {};

	$scope.formData = {
		studies : [
			{ id : 0, name : 'TEW' },
			{ id : 1, name : 'HI' },
			{ id : 2, name : 'HIB' },
			{ id : 3, name : 'SEW' },
			{ id : 4, name : 'Andere (UA stadscampus)' },
			{ id : 5, name : 'Andere (UA buitencampus)' },
			{ id : 6, name : 'Andere (niet-UA)' },
		],
		studyYears : [
			{ id : 0, name : '1ste bachelor' },
			{ id : 1, name : '2de bachelor' },
			{ id : 2, name : '3de bachelor' },
			{ id : 3, name : '1ste master' },
			{ id : 4, name : '2de master' },
			{ id : 5, name : 'Andere' },
		]
	};

	$scope.signupData.study = $scope.formData.studies[0].id;
	$scope.signupData.year = $scope.formData.studyYears[0].id;

	$ionicModal.fromTemplateUrl('templates/auth.login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.loginModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/auth.signup.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.signupModal = modal;
	});

	$scope.changeToForgot = function(){
		$scope.modalTitle = 'Forgot Password';
		$scope.forgotMode = true;
	};

	$scope.changeToLogin = function(){
		$scope.modalTitle = 'Login';
		$scope.forgotMode = false;
	};

	$scope.closeLogin = function() {
		$scope.loginModal.hide();
		$scope.changeToLogin();
	};

	$scope.openLogin = function() {
		$scope.loginModal.show();
	};

	$scope.doLogin = function() {

		var nonce;

		if($scope.loginData.username!=='' && $scope.loginData.password!==''){

			$ionicLoading.show({
				template: 'Loading...'
			});

			User.getAuthNonce().success(function(response){

				if(response.status==='ok'){
          			nonce = response.nonce;

          			User.login(nonce, $scope.loginData.username, $scope.loginData.password).success(function(response){

						if(response.status==='ok'){
							$ionicLoading.hide();
							$scope.loginModal.hide();
							$localstorage.set("token", response.cookie);
							User.set(response.user);
							$rootScope.$broadcast('user.login');
							$location.path('/categories/menu');
						} else {
							$ionicLoading.hide();
							$ionicPopup.alert({
								title: 'Error',
								template: "Je gebruikersnaam/wachtwoord werd niet herkend. Probeer het later nog eens."
							});
						}

					}).error(function(response){
						$ionicLoading.hide();
						$ionicPopup.alert({
							title: 'Error',
							template: "Er is een fout opgetreden tijdens het verbinden met de server. Probeer het later nog eens."
						});
					});

          		} else {
          			$ionicLoading.hide();
          			$ionicPopup.alert({
						title: 'Error',
						template: "Er is een fout opgetreden tijdens het verbinden met de server. Probeer het later nog eens."
					});
          		}

			}).error(function(){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Error',
					template: "Er is een fout opgetreden tijdens het verbinden met de server. Probeer het later nog eens."
				});
			});

		} else {
			$ionicPopup.alert({
				title: 'Error',
				template: "Er mogen geen velden leeg gelaten worden."
			});
		}
	};

	$scope.retrievePassword = function(){

		if($scope.loginData.username!==''){

			$ionicLoading.show({
				template: 'Loading...'
			});

			User.forgotPassword($scope.loginData.username).success(function(response){
				console.log($scope.loginData.username + " sent!");
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Success!',
					template: "Een link voor een wachtwoord reset werd verstuurd. Gelieve je mail te controleren."
				});

			}).error(function(response){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Error',
					template: "Er is een fout opgetreden tijdens het verbinden met de server. Probeer het later nog eens."
				});
			});
		} else {
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: 'Error',
				template: "Gelieve je gebruikersnaam op te geven."
			});
		}

	};


	$scope.closeSignup = function() {
		$scope.signupModal.hide();
	};

	$scope.openSignup = function() {
		$scope.signupModal.show();
	};

	$scope.doSignup = function(form){

		if(form.$valid) {

			$ionicLoading.show({
				template: 'Loading...'
			});

			User.getRegisterNonce().success(function(response){

				if(response.status==='ok'){
          			nonce = response.nonce;

          			User.register(nonce,
					  $scope.signupData.firstName,
					  $scope.signupData.lastName,
					  $scope.signupData.email,
					  $scope.signupData.password,
					  $scope.signupData.study,
					  $scope.signupData.year ).success(function(response){

          				if(response.status==='ok'){

          					$localstorage.set("token", response.cookie);

          					User.getInfo( response.user_id ).success(function(response){

          						if(response.status==='ok'){

          							$ionicLoading.hide();
									$scope.signupModal.hide();
									response.username = $scope.signupData.username;
									response.email = $scope.signupData.email;
									User.set(response);
									$rootScope.$broadcast('user.login');
									$location.path('/categories/menu');

          						} else {
          							$ionicLoading.hide();
									$ionicPopup.alert({
										title: 'Error',
										template: "Er is een fout opgetreden tijdens het verbinden met de server. Probeer het later nog eens."
									});
          						}

          					}).error(function(){
          						$ionicLoading.hide();
								$ionicPopup.alert({
									title: 'Error',
									template: "Er is een fout opgetreden tijdens het verbinden met de server. Probeer het later nog eens."
								});
          					});


          				} else if (response.status ==='error') {

          					$ionicLoading.hide();
          					$ionicPopup.alert({
								title: 'Error',
								template: response.error
							});

          				}

          			}).error(function(){
          				$ionicLoading.hide();
						$ionicPopup.alert({
							title: 'Error',
							template: "Er is een fout opgetreden tijdens het verbinden met de server. Probeer het later nog eens."
						});
          			});

          		}

          	}).error(function(){
          		$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Error',
					template: "Er is een fout opgetreden tijdens het verbinden met de server. Probeer het later nog eens."
				});
  			});

		} else {
			$ionicPopup.alert({
				title: 'Error',
				template: "Er mogen geen velden leeg gelaten worden."
			});
		}

	};

});
