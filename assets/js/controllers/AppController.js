App.controller('AppCtrl', function ($scope, $location) {

  $scope.menu = function(page){
    switch(page)
            {
                case 'overview':
                    $location.path('/dashboard');
                    break;
                case 'users':
                    $location.path('/users');
                    break;
                case 'pharmacies':
                    $location.path('/pharmacies');
                    break;
                case 'newpharmacy':
                    $location.path('/pharmacy/new');
                    break
                case 'orders':
                    $location.path('/orders');
                    break
                case 'neworder':
                    $location.path('/order/new');
                    break
                case 'drugs':
                    $location.path('/drugs');
                    break
                case 'newdrug':
                    $location.path('/drug/new');
                    break
                case 'pharmacyoverview':
                  $location.path('/pharmacydashboard');
                  break;
                case 'pharmacydrugs':
                  $location.path('/pharmacydashboard/drugs');
                  break;
                case 'pharmacyorders':
                  $location.path('/pharmacydashboard/orders');
                  break;
                deafult:
                    $location.path('/dashboard');
            }
  }


});
