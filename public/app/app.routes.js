angular
  .module("routerRoutes", ["ngRoute"])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider

      .when("/singleUser", {
        templateUrl: "app/views/pages/users/single.html",
        controller: "singleCtrl",
        controllerAs: "singleCtrl",
      })

      .when("/editUser/:_id", {
        templateUrl: "app/views/pages/users/single.html",
        controller: "editUser",
        controllerAs: "editUser",
      })

      .when("/users", {
        templateUrl: "app/views/pages/users/all.html",
        controller: "allUserCtrl",
        controllerAs: "allUserCtrl",
      })

      .when("/", {
        templateUrl: "app/views/pages/home.html",
        controller: "homeCtrl",
        controllerAs: "homeCtrl",
      })

      .when("/login", {
        templateUrl: "app/views/pages/login.html",
        controller: "loginCtrl",
        controllerAs: "loginCtrl",
      });

    $locationProvider.html5Mode(true);
  });
