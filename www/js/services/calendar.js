angular.module('roots.services')

.factory('Calendar', function($http, $rootScope, $location, $localstorage) {

  var calendar = [];

  if(typeof $localstorage.get("calendar") !== 'undefined' && $localstorage.get("calendar")!==null){
    calendar = $localstorage.getObject("calendar");
  }

  return {
    set: function(data){
      calendar = data;
      $localstorage.setObject('calendar', data);
    },
    get: function(){
      return calendar;
    },
    fetch: function(){
      return $http.jsonp( encodeURI( api+'user/get_events?callback=JSON_CALLBACK&insecure=cool' ) );
    }
  };

});