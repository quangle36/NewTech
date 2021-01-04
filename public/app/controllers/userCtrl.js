angular
  .module("myAppUserCtrl", [])
  .controller("singleCtrl", function ($scope, User, AuthToken, $location) {
    let vm = this;
    $("#userAction-id").val("Add");

    $scope.save = function (e) {
      e.preventDefault();
      console.log("Submitting");

      User.create($scope.user, AuthToken.getToken()).then((res) => {
        $location.path("/users");
      });
    };
  })
  .controller(
    "allUserCtrl",
    function ($scope, User, Auth, AuthToken, $window, $location) {
      let vm = this;
      vm.header = "All users";
      User.all(AuthToken.getToken())
        .then((res) => {
          const success = res.data.success;
          if (success === false) {
            Auth.logout();
            $window.location.href = "/login";
          }
          $scope.users = res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      $scope.deleteUser = function (_id) {
        User.delete(_id, AuthToken.getToken()).then((res) => {
          $window.location.reload();
        });
      };

      $scope.editUser = function (_id) {
        $location.path(`/editUser/${_id}`);
      };
    }
  )
  .controller(
    "editUser",
    function ($scope, User, $routeParams, AuthToken, $location) {
      $("#userAction-id").val("Update");
      User.get($routeParams._id, AuthToken.getToken()).then((res) => {
        $scope.user = res.data;
      });

      $scope.save = function (e) {
        e.preventDefault();
        console.log("Submitting");
        console.log($scope.user);
        User.update($routeParams._id, AuthToken.getToken(), $scope.user).then(
          (res) => {
            $location.path("/users");
          }
        );
      };
    }
  );
