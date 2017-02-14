App.directive('fileModel', ['$parse', function ($parse) {
          return {
             restrict: 'A',
             link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                   scope.$apply(function(){
                      modelSetter(scope, element[0].files[0]);
                   });
                });
             }
          };
       }]);


App.controller('PharmacyCtrl', function ($scope, $log, $location, pharmacyDataService,$cookies) {

  if ($cookies.get('session_token')) {

    var access_token = $cookies.get('session_token');
    pharmacyDataService.getPharmacies(access_token).then(function(response,error){
      if(response.forbidden){
        $location.path('/login');
      }else if(response.data.pharmacies){
        var data = []
         angular.forEach(response.data.pharmacies, function(obj){
           if(obj.length>0){
             data.push({'id':obj.id, 'name':obj.name,'email':obj.email,'location':obj.location,'phone':obj.phone});
           }else {
              data.push({'id':obj.id, 'name':obj.name,'email':obj.email,'location':obj.location,'phone':obj.phone});
           }

        });
        $scope.pharmacies = data;
      }else{
        console.log("error");
      }
    });
  }else{
    console.log("no cookie");
  }

  // $scope.create = function() {
  //   var file = $scope.image;
  //   var fd = new FormData();
  //   fd.append('file', file);
  //   gameDataService.uploadImage(fd).then(function(response){
  //     if (response.status == 200) {
  //       var photoURL = response.image;
  //       var formData = {name:$scope.name, description:$scope.description, duration:$scope.duration, image:photoURL, timeunit:$scope.timeunit, access_token:$cookies.get('session_token')};
  //       gameDataService.create(formData).then(function(response){
  //        if(response){
  //          $location.path('/games');

  //        }else {

  //        }
  //      });

  //    }else {
  //      console.log("Something is wrong");
  //    }
  //   });

  // },
  // $scope.check = function(checked, id) {
  //   var data = {'id':id}
  //   console.log(checked);
  //   if(checked===1){
  //     gameDataService.createGameinstance(data).then(function(response){
  //       if(response){
  //         console.log(response);
  //       }else {
  //         console.log("ERROR");
  //       }

  //     });

  //   }else if(checked===0){
  //     //Stop Game instance
  //     gameDataService.stopGameinstance(data).then(function(response){
  //       if(response){
  //         console.log(response);
  //       }else {
  //         console.log("ERROR");
  //       }
  //     });


  //   }

  // }

});



