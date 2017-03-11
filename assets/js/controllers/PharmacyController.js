App.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function () {
        scope.$apply(function () {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);


App.controller('PharmacyCtrl', function ($scope, $log, $location, pharmacyDataService, $cookies) {


  $scope.create = function () {

      var formData = {
        name: $scope.name,
        owners_name: $scope.owner,
        email: $scope.email,
        location: $scope.location,
        country: $scope.country,
        city: $scope.city,
        phone: $scope.phone,
        password: $scope.password,
        latitude: $scope.latitude,
        longitude: $scope.longitude,
        opening_hours: $scope.opening_hours,
        closing_hours: $scope.closing_hours,
        pharmacy_reg_number: $scope.Pharmacyreg,
        access_token: $cookies.get('session_token')
      };

      pharmacyDataService.create(formData).then(function (response) {
        console.log(response);
        if (response.data) {
          console.log(response.data);
          $location.path('/pharmacies');

        } else {

        }
      });



    },

    $scope.register = function () {
      var formData = {
        name: $scope.name,
        owners_name: $scope.owner,
        email: $scope.email,
        location: $scope.location,
        country: $scope.country,
        city: $scope.city,
        phone: $scope.phone,
        password: $scope.password,
        latitude: $scope.latitude,
        longitude: $scope.longitude,
        opening_hours: $scope.opening_hours,
        closing_hours: $scope.closing_hours,
        pharmacy_reg_number: $scope.Pharmacyreg,
        access_token: $cookies.get('session_token')
      };

      pharmacyDataService.create(formData).then(function (response) {
        console.log(response);
        if (response.data) {
          console.log(response.data);
          $location.path('/pharmacylogin');

        } else {

        }
      });

    },

    $scope.login = function () {
      var formData = {
        password: $scope.password,
        email: $scope.email
      };
      pharmacyDataService.doLogin(formData).then(function (response) {
        if (response) {
          var session = response.data.Pharmacy.access_token;
          $cookies.put("session_token", session);
          if (response.data.Pharmacy.role.name === "pharmacy-admin") {
            $location.path('/pharmacydashboard');
          } else {
            $location.path('/login');
          }
        } else if (response.message) {
          $scope.message = response.message;
        } else {
          console.log("UNKNOWN ERROR");
        }

      });
    },

    $scope.logout = function () {
      if ($cookies.get('session_token')) {
        var access_token = $cookies.get('session_token');
        pharmacyDataService.doLogout(access_token).then(function (response, error) {
          console.log(response);
          if (response.logout) {
            $cookies.remove('session_token');
            $location.path('/pharmacylogin');
          } else {
            $location.path('/pharmacylogin');
          }
        });
      }
    }


});


App.controller('PharmacyLoadCtrl', function ($scope, $log, $location, pharmacyDataService, $cookies, $state) {
  if ($cookies.get('session_token')) {
    var access_token = $cookies.get('session_token');
    pharmacyDataService.getPharmacy(access_token).then(function (response, error) {
      if (response.data.forbidden) {
        $location.path('/login');
      } else {
        var pharmacy = response.data;
        if (pharmacy.role.name === "admin") {
          if ($state.current.name === "dashboard.overview") {
            $scope.pharmacy = pharmacy;
          } else if ($state.current.name === "pharmacydashboard.overview") {
            $location.path('/dashboard');
          }
        } else if (pharmacy.role.name === "pharmacy-admin") {
          if ($state.current.name === "pharmacydashboard.overview") {
            $scope.pharmacy = pharmacy;
          } else if ($state.current.name === "dashboard.overview") {
            $location.path('/pharmacydashboard');
          }
        }
      }
    });
  } else {
    console.log("no cookie");
  }



});


App.controller('PharmacyListCtrl', function ($scope, $log, $location, pharmacyDataService, $cookies, $state) {
  if ($cookies.get('session_token')) {

    var access_token = $cookies.get('session_token');
    pharmacyDataService.getPharmacies(access_token).then(function (response, error) {
      if (response.forbidden) {
        $location.path('/login');
      } else if (response.data.pharmacies) {
        var data = []
        angular.forEach(response.data.pharmacies, function (obj) {
          if (obj.length > 0) {
            data.push({
              'id': obj.id,
              'name': obj.name,
              'email': obj.email,
              'location': obj.location,
              'phone': obj.phone
            });
          } else {
            data.push({
              'id': obj.id,
              'name': obj.name,
              'email': obj.email,
              'location': obj.location,
              'phone': obj.phone
            });
          }

        });
        $scope.pharmacies = data;
      } else {
        console.log("error");
      }
    });
  } else {
    console.log("no cookie");
  }



});
