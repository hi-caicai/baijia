'use strict';


var app = angular.module('app');

  // 登陆逻辑
app.controller('loginController', function($scope, $state) {
  $scope.login = function() {

    // success
    if (true) {
      $state.go('search');
    } else {
      // failure
    }
  };
});

app.controller('searchController', function($scope, $state) {
  $scope.search = function() {

    if (true) {
      $state.go('map');
    }
  };
});

app.controller('mapController', function($scope, $state, locationService) {


});

app.controller('buyController', function($scope) {
  console.log('buyController');
});
