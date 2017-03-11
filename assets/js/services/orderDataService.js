App.service('orderDataService', function($http, $q) {

  return {
    'getOrders': function(access_token) {
      var defer = $q.defer();
      $http.get('/order/getOrders/?access_token='+access_token).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    },
    'proccess': function(data) {
      console.log(data);
      var defer = $q.defer();
      $http.post('/pharmacy/create', data).then(function success(resp){
        defer.resolve(resp);
      }, function error(resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    },

    
  }
});
