angular.module('roots.services')

.factory('ContactInfo', function($http, $filter) {

	var post_type = 'contact-info';
	var items = [
	             {
	            	'icon' : 'ion-ios-telephone-outline',
	            	'label' : 'Telefoon',
	            	'waarde' : '+324 84 00 00 01'
	             },
	             {
	            	'icon' : 'ion-ios-email-outline',
	            	'label' : 'E-mail',
	            	'waarde' : 'info@wikings.be'
	             }
    ];

	return {
		all: function(data){
			items = data;
		},
		getById: function(id){
			var postID = parseInt(id);
			var selected_post = $filter('filter')(items, function (d) {return d.id === postID;});
			return selected_post[0];
		},
		get: function() {
			return $http.jsonp(api+'get_posts/?post_type=' + post_type +'&posts_per_page=-1&callback=JSON_CALLBACK');
		},
		getFromCategory: function(catID, page, posts_per_page){
			return $http.jsonp(api+'get_posts/?cat='+catID+'&page='+page+'&post_type=' + post_type +'&posts_per_page='+ posts_per_page +'&callback=JSON_CALLBACK');
		}
	};

});