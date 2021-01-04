angular.module("userService", []).factory("User", function ($http) {
  // create a new object
  var userFactory = {}; // get a single user

  userFactory.get = function (id, token) {
    return $http.get(`/api/users/${id}?token=${token}`);
  }; // get all users

  userFactory.all = function (token) {
    return $http.get(`/api/users?token=${token}`);
  }; // create a user

  userFactory.create = function (userData, token) {
    console.log("Create user function is being called");
    return $http.post(`/api/users?token=${token}`, userData);
  };

  // update a user

  userFactory.update = function (id, token, userData) {
    return $http.put(`/api/users/${id}?token=${token}`, userData);
  }; // delete a user

  userFactory.delete = function (id, token) {
    return $http.delete(`/api/users/${id}?token=${token}`);
  }; // return our entire userFactory object

  return userFactory;
});
