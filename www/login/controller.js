angular.module('login.controllers', [])

.controller('LoginCtrl', function($scope, $state, LoginFact, FIREBASE_REF, $firebaseSimpleLogin, userSession){
  
  // {scope: 'email, publish_actions, public_profile'});

  userSession.auth=$firebaseSimpleLogin(new Firebase(FIREBASE_REF));

  $scope.login = function(provider){
    userSession.auth.$login(provider);
  }

  userSession.auth=$firebaseSimpleLogin(new Firebase(FIREBASE_REF));

  $scope.login = function(provider){
    userSession.auth.$login(provider);
  }

});