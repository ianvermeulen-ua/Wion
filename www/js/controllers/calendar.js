angular.module('roots.controllers')

  .controller('CalendarCtrl', function ($scope, $ionicSideMenuDelegate, $timeout, $rootScope, $sce, $localstorage, $ionicModal, $ionicPopup, $ionicLoading, $location, uiCalendarConfig, Calendar) {
    $scope.uiConfig = {
      calendar: {
        height: 750,
        eventClick: function (event) {
          if (event.url !== null && typeof event.url !== 'undefined' && event.url !== '') {
            cordova.InAppBrowser.open(url, '_blank', 'location=yes');
          }

        }
      }
    };

    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.toPrevious = function () {
      uiCalendarConfig.calendars.eventCalendar.fullCalendar('prev');
    };

    $scope.toNext = function () {
      uiCalendarConfig.calendars.eventCalendar.fullCalendar('next');
    };

    $scope.events = Calendar.get();
    $scope.eventSources = [$scope.events];
    var firstRefresh = false;

    $scope.doRefresh = function () {
      Calendar.fetch().success(function (response) {
        var modifiedEvents = [];

        response.events.forEach(function (event) {
          var start = moment(event.start).toDate();
          var end = moment(event.end).toDate();

          var modifiedEvent = {};

          modifiedEvent.title = event.title;
          modifiedEvent.start = start;
          modifiedEvent.end = end;
          modifiedEvent.stick = true;
          modifiedEvent.url = event.url;

          modifiedEvents.push(modifiedEvent);
        });

        Calendar.set(modifiedEvents);

        $scope.events = [];
        $scope.eventSources = [];

        angular.forEach(modifiedEvents, function (event) {
          $scope.events.push(event);
        });

        console.log("set sources!");
        $scope.eventSources = [$scope.events];

        $scope.$broadcast('scroll.refreshComplete');

        if (!firstRefresh) {
          $ionicLoading.hide();
          firstRefresh = true;
        }

      });
    };

    if (navigator.onLine && !firstRefresh) {
      $ionicLoading.show({
        template: 'Refreshing...'
      });
      $scope.doRefresh();
    }

  });
