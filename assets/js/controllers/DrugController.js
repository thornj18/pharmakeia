App.controller('DrugCtrl', function ($scope, $log, $location, drugDataService, $cookies) {

  if ($cookies.get('session_token')) {

    var access_token = $cookies.get('session_token');
    drugDataService.listDrugs(access_token).then(function(response,error){
      if(response.forbidden){
        $location.path('/login');
      }else if(response.data){
        var data = []
         angular.forEach(response.data, function(obj){
           if(obj.length>0){
             data.push({'brand_name':obj.brand_name, 'generic_name':obj.generic_name,'prescription':obj.prescription,'price':obj.price});
           }else {
              data.push({'brand_name':obj.brand_name, 'generic_name':obj.generic_name,'prescription':obj.prescription,'price':obj.price});
           }

        });
        $scope.drugs = data;
      }else{
        console.log("error");
      }
    });
  }else{
    console.log("no cookie");
  }

  $scope.create = function() {
   
      var formData = {brand_name:$scope.brandname, generic_name:$scope.genericname, indications:$scope.indications, contraindications:$scope.contraindications, storage:$scope.storage, caution:$scope.caution, prescription:$scope.prescription, price:$scope.price, email:$scope.email, access_token:$cookies.get('session_token')};
      console.log(formData);
        drugDataService.create(formData).then(function(response){
         if(response){
           $location.path('/drugs');

         }else {

         }
       });
  }


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

