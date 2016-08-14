angular.module('roots.controllers')

.controller('AboutCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicScrollDelegate, ContactInfo) {
    $scope.contactInfos = [];
	$scope.isFetching = true;	
	$scope.shouldRefresh = false;

	$scope.localStoragePrefix = 'contact_info_'; 
	$scope.useLocalStorage = true; // set to false if you don't want local storage

	$scope.loadMore = function(refresh) {
		if($scope.useLocalStorage === true && $localstorage.getObject( $scope.localStoragePrefix + 'items' ) !== null ){
			$scope.contactInfos = $localstorage.getObject( $scope.localStoragePrefix + 'items' );
			ContactInfo.all($scope.contactInfos);
			$scope.isFetching = false;
		} else {
			$scope.getContactInfos();
		}
	};

    $scope.checkForUpdates = function() {
        // check if we are online
        if(!navigator.onLine) {
            return false;
        }

        var localPosts = [];

        // check storage for saved posts
        // if we have stored some, then we need to verify their modified date and count
        if ($localstorage.getObject( $scope.localStoragePrefix + 'items' ) !== null) {
            localPosts = $localstorage.getObject( $scope.localStoragePrefix + 'items' );
        }
        else {
            return true;
        }

        var shouldUpdate = false;

        ContactInfo.get().success(function(response) {
            var onlinePosts = response.posts;

            if(onlinePosts.length != localPosts.length) {
                $scope.getContactInfos();
                return;
            }

            onlinePosts.some(function(post, index) {
                var onlineModified = new Date(post.modified);
                var localModified = new Date(localPosts[index].modified);

                if(localModified < onlineModified) {
                    $scope.getContactInfos();
                    return true;
                }
                return false;
            });
        });
    };

	$scope.getContactInfos = function(){
		// size of the picture, taxonomy and order by
		ContactInfo.get().success(function(response){
			$scope.contactInfos = response.posts;
			ContactInfo.all($scope.contactInfos);

			$scope.isFetching = false;
			
			if($scope.useLocalStorage === true){
				$localstorage.setObject($scope.localStoragePrefix + 'items', $scope.contactInfos);
			}

			if($scope.shouldRefresh===true){
				$scope.$broadcast('scroll.refreshComplete');
				$scope.shouldRefresh = false;
			}

		});
	};

	$scope.doRefresh = function(){
		$localstorage.remove($scope.localStoragePrefix + 'items');
		$scope.contactInfos = [];
		$scope.shouldRefresh = true;
		$scope.loadMore();		
	};

	// let's start
	$scope.loadMore();

    $scope.checkForUpdates();
});
