App.controller('UserCtrl', function ($scope, $log, $location, userDataService,$cookies) {

  $scope.register = function() {
    var formData = {name:$scope.name, email:$scope.email, password:$scope.password, phone:$scope.phone};
    userDataService.doRegistration(formData).then(function(response){
      if(response.data){
        $location.path('/login');

      }else {
        console.log("ERROR");
      }

    });
  },
    
  $scope.login = function() {
    var formData = {password:$scope.password, phone:$scope.phone};
    userDataService.doLogin(formData).then(function(response){
      if(response){
        var session = response.data.user.access_token;
        $cookies.put("session_token", session);
        if(response.data.user.role.name === "admin"){
          $location.path('/dashboard');
        }else if(response.data.user.role.name === "pharmacy-admin"){
          $location.path('/pharmacydashboard');
        }else{
          $location.path('/login');
        }
      }else if(response.message){
        $scope.message = response.message;
      }else {
          console.log("UNKNOWN ERROR");
      }

    });
  },

  $scope.logout = function() {
    if ($cookies.get('session_token')) {
      var access_token = $cookies.get('session_token');
    userDataService.doLogout(access_token).then(function(response,error){
      console.log(response);
      if(response.logout){
        $cookies.remove('session_token');
        $location.path('/adminlogin');
      }
      else {
        $location.path('/adminlogin');
      }
    });
  }
}

});



App.controller('OnLoadCtrl', function ($scope, $log, $location, userDataService,$cookies, $state) {
  if ($cookies.get('session_token')) {
    var access_token = $cookies.get('session_token');
    userDataService.getUser(access_token).then(function(response,error){
      if(response.data.forbidden){
        $location.path('/login');
      }else {
        var user = response.data;
        if(user.role.name === "admin"){
          if($state.current.name === "dashboard.overview"){
            $scope.user = user;
          }else if($state.current.name === "pharmacydashboard.overview"){
            $location.path('/dashboard');
          }
        }else if(user.role.name === "pharmacy-admin"){
          if($state.current.name === "pharmacydashboard.overview"){
            $scope.user = user;
          }else if($state.current.name === "dashboard.overview"){
            $location.path('/pharmacydashboard');
          }
        }
      }
    });
  }else{
    console.log("no cookie");
  }

  

});



App.controller('listusersCtrl', function ($scope, $log, $location, userDataService,$cookies) {

  if ($cookies.get('session_token')) {
    var access_token = $cookies.get('session_token');
    userDataService.listUsers(access_token).then(function(response,error){
      if(response.forbidden){
        $scope.message = response;
      }else {
          $scope.listusers = response.data;
      }
    });
  }else{
    console.log("no cookie");
  }

});
