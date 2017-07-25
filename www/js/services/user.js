angular.module('roots.services')

.factory('User', function($http, $rootScope, $location, $localstorage) {

  var isLoggedIn = false;
  var profile = {};

  if(typeof $localstorage.get("token") !== 'undefined' && $localstorage.get("token")!==null){
    isLoggedIn = true;
  }

  if(typeof $localstorage.get("user") !== 'undefined' && $localstorage.get("user")!==null){
    profile = $localstorage.getObject("user");
  }

  $rootScope.$on('user.logout', function() {
    isLoggedIn = false;
    $location.path('/auth/index');
  });

  $rootScope.$on('user.login', function() {
    isLoggedIn = true;
  });

  return {
    set: function(data){
      profile = data;
      $localstorage.setObject('user', data);
    },
    get: function(){
      return profile;
    },
    id: function() {
      return profile.id;
    },
    name: function(){
      return profile.firstname + ' ' + profile.lastname;
    },
    nickname: function(){
      return profile.nickname;
    },
    email: function(){
      return profile.email;
    },
    role : function() {
      return profile.role;
    },
    isLoggedIn: function() {
      return isLoggedIn;
    },
    register: function(nonce, firstName, lastName, email, password, study, year){
      var registerRequest = $http.jsonp( encodeURI( api+'user/register/?nonce='+nonce+
      '&display_name='+firstName+'%20'+lastName+
        '&first_name='+firstName+
        '&last_name='+lastName+
        '&email='+email+
        '&user_pass='+password+
        '&notify=no&insecure=cool&callback=JSON_CALLBACK' ) );

        registerRequest.success( function( registerResponse ) {
          if ( registerResponse.status === 'ok' ) {
            var cookie = registerResponse.cookie;

            var updateRequest = $http.jsonp( encodeURI( api + 'user/update_user_meta_vars/?cookie='+cookie+
            '&study='+study+
            '&year='+year+
            '&notify=no&insecure=cool&callback=JSON_CALLBACK' ) );
          }
        } );

        return registerRequest;
    },
    getAuthNonce: function(){
      return $http.jsonp(api+'get_nonce/?controller=user&method=generate_auth_cookie&insecure=cool&callback=JSON_CALLBACK');
    },
    getRegisterNonce: function(){
      return $http.jsonp(api+'get_nonce/?controller=user&method=register&insecure=cool&callback=JSON_CALLBACK');
    },
    requestMembership: function(cookie) {
      return $http.jsonp( encodeURI( api+'user/request_user_membership/?cookie='+cookie+'&insecure=cool&callback=JSON_CALLBACK' ) );
    },
    getInfo: function(user_id){
      return $http.jsonp( encodeURI( api+'user/get_userinfo/?user_id='+user_id+'&insecure=cool&callback=JSON_CALLBACK' ) );
    },
    login: function(nonce, username, password) {
      return $http.jsonp( encodeURI( api+'user/generate_auth_cookie/?nonce='+nonce+'&username='+username+'&password='+password+'&insecure=cool&callback=JSON_CALLBACK' ) );
    },
    forgotPassword: function(username){
      return $http.jsonp( encodeURI( api+'user/retrieve_password/?user_login='+username+'&callback=JSON_CALLBACK&insecure=cool' ) );
    },
    logout: function() {
      $localstorage.remove("token");
      $localstorage.remove("user");
      $rootScope.$broadcast('user.logout');
    }
  };

});
