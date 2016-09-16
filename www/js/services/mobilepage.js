angular.module('roots.services')

.factory('MobilePage', function($http, $filter) {

	var post_type = 'mobile-page';
	var items = [
	             {
					 'section-slug' : 'about',
					 'content' : 'Wij zijn Wikings.'
				 }
    ];

	var category = '';

	return {
		all: function(data){
			items = data;
		},
		setCategory : function(newCategory) {
			category = newCategory;
		},
		get: function() {
			return $http.jsonp(api + 'get_category_posts/?slug=' + category + '&post_type=' + post_type + '&callback=JSON_CALLBACK');
		}
	};

});