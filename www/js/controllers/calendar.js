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

    $scope.eventSources = [];
    $scope.eventSources.push([]);

    var firstRefresh = false;

    $scope.doRefresh = function () {
      Calendar.fetch().success(function (response) {
        $scope.eventSources[0].slice(0, $scope.eventSources.length);

        response.events.forEach(function (event) {
          var start = moment(event.start).toDate();
          var end = moment(event.end).toDate();

          var modifiedEvent = {};

          modifiedEvent.title = event.title;
          modifiedEvent.start = start;
          modifiedEvent.end = end;
          modifiedEvent.stick = true;
          modifiedEvent.url = event.url;

          $scope.eventSources[0].push(modifiedEvent);
        });

        Calendar.set($scope.eventSources[0]);


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
    else {
      $scope.eventSources = [];
      $scope.eventSources.push([]);

      var calendar = Calendar.get();

      for (var i = 0; i < calendar.length; i++) {
        $scope.eventSources[0].push(calendar[i]);
      }
    }

  });
