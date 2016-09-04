angular.module('roots.controllers')

.controller('MemberCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $compile, User) {
    $scope.role = User.role();
    $scope.membershipRequesting = false;

    $scope.requestMembership = function() {
        var token = $localstorage.get("token");
        
        $scope.membershipRequesting = true;
        
        User.requestMembership( token ).success( function( response ) { 
            var profile = User.get();
            profile.role = 'nietbetaald';

            $scope.role = profile.role;

            User.set( profile );

            $scope.membershipRequesting = false;
        } );
        
    };
} );