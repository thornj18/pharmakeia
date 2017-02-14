App.service('userDataService', function($http, $q) {

  return {
    'doRegistration': function(data) {
      var defer = $q.defer();
      $http.post('/register', data).then(function success(resp){
        defer.resolve(resp.data);
      }, function error(resp) {
        defer.reject(resp);
      });
      return defer.promise;
    },

    'doLogin': function(data) {
      var defer = $q.defer();
      $http.post('/user/login', data).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.reject(resp);
      });
      return defer.promise;
    },

    'doLogout': function(access_token) {
      var defer = $q.defer();
      $http.get('/logout/'+access_token).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.reject(resp);
      });
      return defer.promise;
    },
    'getUser': function(access_token) {
      var defer = $q.defer();
      $http.get('/user/?access_token='+access_token).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    },
    'listUsers': function(access_token) {
      var defer = $q.defer();
      $http.get('/user/list/?access_token='+access_token).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    },
  }
});
