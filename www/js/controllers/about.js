angular.module('roots.controllers')

.controller('AboutCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicScrollDelegate, ContactInfo, MobilePage) {
	$scope.isFetching = true;	
	$scope.shouldRefresh = false;

	// set the page category to about
	MobilePage.setCategory('about');

	/**
	 * Dictionary of objects that contain both the factory of the object and the prefix for storage
	 */
	var updateObjects = {
		'contact' : {
			'factory' : ContactInfo,
			'prefix' : 'contact_info_'
		},
		'page' : {
			'factory' : MobilePage,
			'prefix' : 'mobile_page_'
		}
	};

	/**
	 * The content that require updating
	 */
	$scope.content = {
		'contact' : [],
		'page' : []
	};

	/**
	 * Check if an object is stored on local storage
	 * 
	 * @param objectSlug The slug of the object that is checked
	 * @returns true if the object is present on storage
	 */
	function isObjectStored( objectSlug ) {
		return $localstorage.getObject( updateObjects[ objectSlug ].prefix + 'items' ) !== null;
	}

	/**
	 * Gets an object stored on local storage
	 * 
	 * @param objectSlug The slug of the object that is read
	 * @returns the object read from local storage
	 */
	function getStoredObject( objectSlug ) {
		return $localstorage.getObject( updateObjects[ objectSlug ].prefix + 'items' );
	}

	/**
	 * Sets an object stored on local storage
	 * 
	 * @param objectSlug The slug of the object that is written to
	 * @param value The new value for the object
	 */
	function setStoredObject( objectSlug, value ) {
		$localstorage.setObject( updateObjects[ objectSlug ].prefix + 'items', value );
	}

	/**
	 * Performs an update for the update objects
	 * 
	 * @param refresh
	 */
	$scope.loadMore = function( refresh ) {
		for ( var updateObject in updateObjects ) {
			if ( isObjectStored( updateObject ) ) {
				$scope.content[ updateObject ] = getStoredObject( updateObject );
				updateObjects[ updateObject ].factory.all( $scope.content[ updateObject ] );
				$scope.isFetching = false;
			}
			else {
				$scope.isFetching = true;
				fetchUpdates( updateObject );
			}
		}
	};

	/**
	 * Broadcast the refresh complete event if needed
	 */
	function broadcastRefreshComplete() {
		if($scope.shouldRefresh===true){
			$scope.$broadcast('scroll.refreshComplete');
			$scope.shouldRefresh = false;
		}
	}

	/**
	 * Perform a AJAX get to update the given object
	 * 
	 * @param objectSlug slug for the object that requires updating
	 */
	function fetchUpdates( objectSlug ) {
		updateObjects[ objectSlug ].factory.get().success( function( response ) {
			$scope.content[ objectSlug ] = response.posts;
			updateObjects[ objectSlug ].factory.all( $scope.content[ objectSlug ] );

			$scope.isFetching = false;
			
			setStoredObject( objectSlug, $scope.content[ objectSlug ] );

			broadcastRefreshComplete();
		});
	}

	/**
	 * Checks for updates for the update objects
	 */
    function checkForUpdates() {
        // check if we are online
        if(!navigator.onLine) {
            return false;
        }

        // check storage for saved posts
		for( var updateObject in updateObjects ) {
			if ( !isObjectStored( updateObject ) ) {
				fetchUpdates( updateObject );
				return true;
			}

			var localPosts = getStoredObject( updateObject );
			updateIfNeeded( updateObject, localPosts );
		}
    }

	/**
	 * Update the object if needed
	 * 
	 * @param updateObject The object that might require updating
	 * @param localPosts The posts that are already on local storage
	 */
    function updateIfNeeded( updateObject, localPosts ) {
        updateObjects[ updateObject ].factory.get().success( function( response ) {
			var onlinePosts = response.posts;

			if(onlinePosts.length != localPosts.length) {
				fetchUpdates( updateObject );
				return;
			}

			onlinePosts.some(function(post, index) {
				var onlineModified = new Date(post.modified);
				var localModified = new Date(localPosts[index].modified);

				if(localModified < onlineModified) {
					fetchUpdates( updateObject );
					return true;
				}
				return false;
            });
        });
    }

	$scope.doRefresh = function(){
		$localstorage.remove($scope.contactStoragePrefix + 'items');
		$scope.contactInfos = [];
		$scope.mobilePages = [];
		$scope.shouldRefresh = true;
		$scope.loadMore();		
	};

	// let's start
	$scope.loadMore();

    checkForUpdates();
});
