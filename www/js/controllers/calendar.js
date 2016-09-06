angular.module('roots.controllers')

.controller('CalendarCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicModal, $ionicPopup, $ionicLoading, $location, Calendar) {
    $scope.events = Calendar.get();
    $scope.eventSources = [ $scope.events ];
    
    $scope.doRefresh = function() {
        Calendar.fetch().success( function( response ) {
            var modifiedEvents = [];
            
            response.events.forEach( function( event ) {               
                var start = moment( event.start ).toDate();
                var end = moment( event.end ).toDate();

                var modifiedEvent = {};
        
                modifiedEvent.title = event.title;
                modifiedEvent.start = start;
                modifiedEvent.end = end;
                modifiedEvent.sticky = true;
                modifiedEvent.url = event.url;

                modifiedEvents.push( modifiedEvent );
            } );

            Calendar.set( modifiedEvents );

            $scope.events = [];
            $scope.eventSources = [];

            angular.forEach(modifiedEvents, function (event) {
                $scope.events.push(event);
            });
        } );
    };

    $scope.doRefresh();
} );