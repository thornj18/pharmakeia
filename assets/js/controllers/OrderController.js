App.controller('OrderCtrl', function ($scope, $log, $location, orderDataService, $cookies) {

  if ($cookies.get('session_token')) {

    var access_token = $cookies.get('session_token');
    orderDataService.getOrders(access_token).then(function(response,error){
      if(response.data.forbidden){
        $location.path('/login');
      }else if(response.data){
        console.log(response.data);
      }else{
        console.log("error");
      }
    });
  }else{
    console.log("no cookie");
  }

 

});

