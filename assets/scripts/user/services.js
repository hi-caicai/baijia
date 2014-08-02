'use strict';

var app = angular.module('app');

app.factory('assetService', function($http, $q) {

    var list = function(type) {
      var deferred = $q.defer();

      $http({
        url: '/asset',
        method: 'GET'
      })
      .success(deferred.resolve)
      .error(deferred.reject);

      return deferred.promise;
    };

    var search = function(keyword) {
      var deferred = $q.defer();

      $http({
        url: '/asset/search',
        method: 'POST',
        data: {
          'keyword': keyword
        }
      })
      .success(deferred.resolve)
      .error(deferred.reject);

      return deferred.promise;
    };


    return {
      search: search,
      list: list
    };
  });

/* 百度map接口说明：
 * map.Point(lng:Number, lat:Number)
 *
 */

app.factory('mapService', function($http, $q, $rootScope) {



  function getCustomPoints(map){
    /*
     * 数据格式说明：
     * [{ name: 'xxx', 'id': '', point: obj }]
     */
    var dataList = $rootScope.searchResults;

    /* 如果没有搜索直接进来，全部显示 */
    if(!dataList) {
      return;
    }

    var bounds = map.getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var lngSpan = Math.abs(sw.lng - ne.lng);
    var latSpan = Math.abs(ne.lat - sw.lat);

    for (var i = 0; i < dataList.length; i ++) {
      dataList[i].point = new BMap.Point( dataList[i].owner.points.lng, dataList[i].owner.points.lat);
    }
    return dataList;
  }

  function createPointsOnMap(map){
    var dataList = getCustomPoints(map);

    /* 如果没有搜索直接进来，全部显示 */
    if(!dataList) {
      return;
    }

    for(var i=0;i<dataList.length;i++){
      var marker = new BMap.Marker(dataList[i].point); //创建标注
      map.addOverlay(marker);// 将标注添加到地图

      //创建信息窗口
      (function(item){
        var html = [
          '<div id="J_markerTip"">'+
              '<div class="tipbox">'+
                  '<h4>'+item.name+'</h4>'+
                  '<p>'+item.desc+'</p>'+
                  '<p><a href="###">查看详情</a></p>'+
              '</div>'+
          '</div>'
        ].join('');
        var infoWindow = new BMap.InfoWindow(html);
        marker.addEventListener("click", function(){this.openInfoWindow(infoWindow);});
      })(dataList[i]);
    }
  }

  function initMap(me_pos) {
    var map = new BMap.Map("J_mymap");
    var me_point = new BMap.Point(me_pos.lng, me_pos.lat);
    map.centerAndZoom(me_point, 11);
    map.addControl(new BMap.ZoomControl()); //添加地图缩放控件
    createPointsOnMap(map);
  }

  return {
    initMap: initMap
  };
});

app.factory('locationService', function($http, $q) {


  var getLocation = function() {

    var geolocation = {};
    var deferred = $q.defer();

    Blend.device.geolocation.get({

      onsuccess: function(data) {
        geolocation = {
          "lng": data.longitude,
          "lat": data.latitude
        };
        deferred.resolve(geolocation);
        console.log("获取个人位置 =>", geolocation);
      },

      onfail: function(err) {
        geolocation = {
          "lng": 121.581,
          "lat": 31.201
        };
        deferred.resolve(geolocation);
      }
    });

    return deferred.promise;
  };

  /**
   * getDistance of two point
   * return xx km
   */
  var getDistance = function(lat1, lng1, lat2, lng2) {

    var EARTH_RADIUS = 6378.137; //地球半径

    var rad = function (d) {
      return d * Math.PI / 180.0;
    };

    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  };

  return {
    getLocation: getLocation,
    getDistance: getDistance
  };

});

