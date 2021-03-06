'use strict';


var app = angular.module('app');

// 登陆逻辑
app.controller('authController', function($scope, $state, $resource) {
  var actionTextMap = {
    login: '登录',
    register: '注册'
  };

  var action = $state.current.data.action;
  var Authorization = $resource('/user/:action', { action: action });

  $scope.action = action;
  $scope.actionText = actionTextMap[action];
  $scope.authorize = function () {
    var credentials = {
      userId: this.userId,
      password: this.password,
      username: this.userId
    };

    var auth = Authorization.save(credentials, function() {
      auth && auth.status === 'success' ? $state.go('dashboard') : onError(auth);
    }, onError);

    function onError (error) {
      // error handler
      console.log(error);
    }
  };
});

app.controller('dashboardController', function($scope, $state, orderService) {

  orderService.list()
    .then(
      function(data) {
        $scope.orders = data;
        console.log($scope.orders);
      },
      function(error) {
        console.log('error:' + error);
      }
    );

});

app.controller('orderController', function($scope,$rootScope) {

    $http('/order').success(function(data){
        $scope.orders = data
        $rootScope.orders = data
    })

});

app.controller('discoverController', function($scope,$rootScope) {

    $http('/requires').success(function(data){
        $scope.requires = data
        $rootScope.requires = data
    })

});

app.controller('mapController', function($scope) {

});

app.controller('storeController', function($scope, storeService) {
  storeService.list()
    .then(
      function(data) {
        $scope.assets = data;
      }
    );

  $scope.add = function() {

  };

  $scope.del = function() {

  };
});

app.controller('addStoreController', function($scope, $http, $state, qrService) {

  $scope.add = function() {
    $http.post('/asset', {
      name: this.name,
      price: this.price,
      img: 'http://baidu-baijia.b0.upaiyun.com/asset1.jpg',
      qr: ''
    }).then(function (data) {
      console.log(data);
    }, function (err) {
      console.log(err);
    });

    // 调用条形码扫码功能
    //qrService.openQr().then(function(res){

    //});

  }

});

app.controller('deliverController', function($scope) {
  console.log('deliverController');
});
