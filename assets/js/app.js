'use strict';

var App = angular.module('pharmakeia', ['ui.router','ngCookies']);
angular.module('App', ['file-model']);
App.config(function($stateProvider, $urlRouterProvider) {


  $urlRouterProvider.otherwise('/404');
  $stateProvider
    .state('home',{
      url:'/',
      templateUrl:'templates/pages/index.html'
    })
    .state('404',{
      url:'/404',
      templateUrl:'templates/pages/404.html'
    })
    .state('adminlogin',{
      url:'/adminlogin',
      templateUrl:'templates/pages/adminlogin.html'
    })
    .state('pharmacylogin',{
      url:'/pharmacylogin',
      templateUrl:'templates/pages/pharmacylogin.html'
    })
    .state('pharmacyregister',{
      url:'/pharmacyregister',
      templateUrl:'templates/pages/pharmacyregister.html'
    })
    .state('dashboard',{
      templateUrl:'templates/pages/dashboard.html'
    })
    .state('dashboard.overview',{
      url:'/dashboard',
      templateUrl:'templates/pages/dashboard.overview.html'
    })
    .state('dashboard.users',{
      url:'/users',
      templateUrl:'templates/pages/dashboard.users.html'
    })
    .state('dashboard.pharmacies',{
      url:'/pharmacies',
      templateUrl:'templates/pages/dashboard.pharmacies.html'
    })
    .state('dashboard.newpharmacy',{
      url:'/pharmacy/new',
      templateUrl:'templates/pages/dashboard.pharmacy.new.html'
    })
    .state('dashboard.account',{
      url:'/account',
      templateUrl:'templates/pages/dashboard.account.html'
    })
    .state('dashboard.orders',{
      url:'/orders',
      templateUrl:'templates/pages/dashboard.orders.html'
    })
    .state('dashboard.neworder',{
      url:'/order/new',
      templateUrl:'templates/pages/dashboard.order.new.html'
    })
    .state('dashboard.drugs',{
      url:'/drugs',
      templateUrl:'templates/pages/dashboard.drugs.html'
    })
    .state('dashboard.newdrug',{
      url:'/drug/new',
      templateUrl:'templates/pages/dashboard.drug.new.html'
    })
    .state('pharmacydashboard',{

      templateUrl:'templates/pages/pharmacydashboard.html'
    })
    .state('pharmacydashboard.overview',{
      url:'/pharmacydashboard',
      templateUrl:'templates/pages/pharmacydashboard.overview.html'
    })
    .state('pharmacydashboard.drugs',{
      url:'/pharmacydashboard/drugs',
      templateUrl:'templates/pages/pharmacydashboard.drugs.html'
    })
    .state('pharmacydashboard.orders',{
      url:'/pharmacydashboard/orders',
      templateUrl:'templates/pages/pharmacydashboard.orders.html'
    })
    .state('pharmacydashboard.newdrug',{
      url:'/pharmacydashboard/drug/new',
      templateUrl:'templates/pages/pharmacydashboard.drug.new.html'
    });

});
