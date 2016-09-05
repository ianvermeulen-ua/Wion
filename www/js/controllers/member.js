angular.module('roots.controllers')

.controller('MemberCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $compile, $ionicPopup, $ionicLoading, User) {
    $scope.role = User.role();

    $scope.requestMembership = function() {
        var token = $localstorage.get("token");

        $ionicLoading.show({
            template: 'Requesting...'
        });

        User.requestMembership( token ).success( function( response ) { 
            var profile = User.get();
            profile.role = 'nietbetaald';

            $scope.role = profile.role;

            User.set( profile );

            $rootScope.$broadcast( 'membership_changed' );
            $ionicLoading.hide();
        } )
        .error( function( response ) {
            $ionicLoading.hide();

            $ionicPopup.alert( {
                title: 'Error',
                template: "Er is een fout opgetreden met het verbinden met de server. Probeer later opnieuw"
            } );
        } );
    };

    $scope.checkPayment = function() {
        $ionicLoading.show({
            template: 'Checking...'
        });

        User.getInfo( User.id() ).success( function( response ) {
            if ( response.role == 'lid' ) {
                $scope.role = 'lid';

                User.set( response );
                $rootScope.$broadcast( 'membership_changed' );
            }
            else {
                $scope.paymentMessage = 'Uw betaling is nog niet goedgekeurd. Probeer het later opnieuw!';
            }
            $ionicLoading.hide();
        } )
        .error( function( response ) {
            $ionicLoading.hide();

            $ionicPopup.alert( {
                title: 'Error',
                template: "Er is een fout opgetreden met het verbinden met de server. Probeer later opnieuw"
            } );
        } );
        
    };
} );