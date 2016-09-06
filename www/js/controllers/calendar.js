angular.module('roots.controllers')

.controller('CalendarCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicModal, $ionicPopup, $ionicLoading, $location, Calendar) {
    
    $scope.doRefresh = function() {
        Calendar.fetch().success( function( response ) {
            var modifiedEvents = [];
            
            for ( var event in response.events ) {
                var start = new Date( event.start );
                var end = new Date( event.end );

                console.log( start );
                console.log( end );

                var modifiedEvent = event;
                modifiedEvent.start = start;
                modifiedEvent.end = end;

                modifiedEvents.push( modifiedEvent );
            }

            Calendar.set( modifiedEvents );
        } );
    };

    $scope.doRefresh();

    var calendar = Calendar.get();

    $scope.eventSources = calendar.events;
} );