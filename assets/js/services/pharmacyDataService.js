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
      console.log(data);
      var defer = $q.defer();
      $http.post('/pharmacy/create', data).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    },


    'doLogin': function(data) {
      var defer = $q.defer();
      $http.post('/pharmacy/login', data).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.reject(resp);
      });
      return defer.promise;
    },

    'doLogout': function(access_token) {
      var defer = $q.defer();
      $http.get('/pharmacy/logout/?access_token='+access_token).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.reject(resp);
      });
      return defer.promise;
    },
    'getPharmacy': function(access_token) {
      var defer = $q.defer();
      $http.get('/pharmacy/get/?access_token='+access_token).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    },

    
  }
});
