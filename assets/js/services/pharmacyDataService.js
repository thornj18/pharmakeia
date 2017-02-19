App.service('pharmacyDataService', function($http, $q) {

  return {
    'getPharmacies': function(access_token) {
      var defer = $q.defer();
      $http.get('/pharmacy/list/?access_token='+access_token).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    },
    'create': function(data) {
      var defer = $q.defer();
      $http.post('/pharmacy/create', data).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    },

    'uploadImage': function(data){
        var defer = $q.defer();
        $http.post(
          '/file/uploadImage',
          data, {
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }
        ).success(function(resp){
          defer.resolve(resp);
        }).error(function(err){
          defer.resolve(err);
        });
        return defer.promise;
    },

    'createGameinstance': function(data) {
      var defer = $q.defer();
      $http.post('/gameinstance/create', data).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.resolve(err);
      });
      return defer.promise;
    },
    'stopGameinstance': function(data) {
      var defer = $q.defer();
      $http.post('/gameinstance/stop', data).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.resolve(err);
      });
      return defer.promise;
    },
    'getCurrenGames': function(access_token) {
      var defer = $q.defer();
      $http.get('/gameinstance/?status=current&access_token='+access_token).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.resolve(err);
      });
      return defer.promise;
    },
    'getGame': function(data) {
      var defer = $q.defer();
      $http.get('/gameinstance/'+data.gameid+'/?status=current&access_token='+data.access_token).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.resolve(err);
      });
      return defer.promise;
    },
    'playGame': function(data) {
      var defer = $q.defer();
      $http.post('/bid/', data).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.resolve(err);
      });
      return defer.promise;
    },
  }
});
