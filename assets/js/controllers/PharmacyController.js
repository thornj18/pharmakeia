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
            pharmacy_reg_number: $scope.pharmacyreg,
            access_token: $cookies.get('session_token')};
        
          pharmacyDataService.create(formData).then(function (response) {
            if (response) {
              console.log(response.data);
              $location.path('/pharmacies');

            } else {

            }
          });

       

    }
    

});
