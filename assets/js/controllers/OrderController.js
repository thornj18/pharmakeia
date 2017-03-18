App.controller('OrderCtrl', function ($scope, $log, $location, orderDataService, $cookies) {

  if ($cookies.get('session_token')) {

    var access_token = $cookies.get('session_token');
    orderDataService.getOrders(access_token).then(function (response, error) {
      if (response.data.forbidden) {
        $location.path('/login');
      } else if (response.data) {
        var data = []
        console.log(response.data);
        angular.forEach(response.data, function (obj) {
          console.log("here");
          if (obj.length > 0) {
            data.push({
              'date': obj.createdAt,
              'user': obj.to_user.name,
              'pharmacy': obj.from_pharmacy.name,
              'status': obj.status
            });
          } else {
            data.push({
              'date': obj.createdAt,
              'user': obj.to_user.name,
              'pharmacy': obj.from_pharmacy.name,
              'status': obj.status
            });
          }

        });
        $scope.orders = data;
      } else {
        console.log("error");
      }
    });
  } else {
    console.log("no cookie");
  }



});
