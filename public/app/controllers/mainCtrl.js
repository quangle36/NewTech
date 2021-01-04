

angular
  .module("myAppMainCtrl", [])
  .controller("loginCtrl", function (Auth, $scope, $location) {
    let vm = this;
    vm.header = "Login";
    $scope.login = function () {
      Auth.login($scope.username, $scope.password).then((res) => {
        let result = res.data;
        if (result.success === false) {
          $("#message-id").text(result.message);
          $("#myModal").modal("show");
        } else {
          $location.path("/users");
        }
      });
    };
    $scope.loginWithGoogle = function () {
      Auth.loginWithGoogle();
    };

    $scope.loginWithFacebook = function () {
      Auth.loginWithFacebook();
    };
  })
  .controller("homeCtrl", function ($scope) {
    let vm = this;
    vm.content = "Welcome";
  })
  .controller("navCtrl", function (Auth, $scope, $location, $route) {
    let vm = this;
    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.goToHome = function () {
      $location.path("/");
    };

    $scope.goToLogin = function () {
      if ($scope.isLoggedIn) {
        Auth.logout();
        vm.loginLabel = "Login";
        $scope.isLoggedIn = Auth.isLoggedIn();
        $location.path("/");
      } else {
        $location.path("/login");
      }
      
    };

    $scope.goToUsers = function () {
      $location.path("/users");
    };

    vm.loginLabel = "Login";
    if ($scope.isLoggedIn) {
      vm.loginLabel = "Logout";
      var accessTokenObj = localStorage.getItem("token");
      //var decoded = atob(accessTokenObj.split('.')[1]);
      var base64Url = accessTokenObj.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var decoded = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

      var json = JSON.parse(decoded);
      var name = json.name;
      vm.name = name;
      //vm.name = "Wang";
    }

    vm.homeLabel = "Home";
  });
