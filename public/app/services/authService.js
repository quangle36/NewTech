
angular
  .module("authService", [])
  .factory("Auth", function ($http, $q, AuthToken, $window) {
    var authFactory = {};

    // login with google account
    
    authFactory.loginWithGoogle = function () {
      $window.location.href = "/api/google";
    };

    authFactory.loginWithFacebook = function () {
      $window.location.href = "/api/facebook";
    };

    // login
    authFactory.login = function (username, password) {
      return $http
        .post("/api/authenticate", {
          username: username,
          password: password,
        })
        .then(function (res) {
          AuthToken.setToken(res.data.token);
          return res;
        });
    };

    // logout
    authFactory.logout = function () {
      AuthToken.setToken();
    };

    // check if the user is logged in
    authFactory.isLoggedIn = function () {
      if (AuthToken.getToken()) {
        return true;
      }
      return false;
    };
    authFactory.getUserName = () => {
      
    }
    // get the logged in user
    authFactory.getUser = function () {
      if (AuthToken.getToken()) return $http.get("/api/me", { cache: true });
      else return $q.reject({ message: "User has no token." });
    };

    authFactory.createSampleUser = function () {
      $http.post("/api/sample");
    };

    return authFactory;
  })
  //   factory for handling tokens
  // inject $window to store token client-side
  .factory("AuthToken", function ($window) {
    var authTokenFactory = {};

    // get token out of local storage

    authTokenFactory.getToken = function () {
      return $window.localStorage.getItem("token");
    };

    /* function to set token or clear token
        if a token is passed, set the token
        if there is no token, clear it from local storage*/
    authTokenFactory.setToken = function (token) {
      if (token) {
        $window.localStorage.setItem("token", token);
      } else $window.localStorage.removeItem("token");
    };

    return authTokenFactory;
  })
  //   application configuration to integrate token into requests
  .factory("AuthInterceptor", function ($q, $location, AuthToken) {
    var interceptorFactory = {};

    interceptorFactory.request = function (config) {
      var token = AuthToken.getToken();

      if (token) config.headers["x-access-token"] = token;

      return config;
    };

    interceptorFactory.responseError = function (response) {
      if (response.status == 403) {
        AuthToken.setToken();
        $location.path("/login");
      }

      return $q.reject(response);
    };

    return interceptorFactory;
  });
