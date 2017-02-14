App.service('drugDataService', function($http, $q) {

  return {
    'create': function(data) {
    console.log(data);
      var defer = $q.defer();
      $http.post('/drug/create', data).then(function success(resp){
        defer.resolve(resp.data);
      }, function error(resp) {
        defer.reject(resp);
      });
      return defer.promise;
    },

    
    'listDrugs': function(access_token) {
      var defer = $q.defer();
      $http.get('/drug/list/?access_token='+access_token).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    }
  }
});
