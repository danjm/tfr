angular.module('preferences.controllers', [])

.controller('PlaceCtrl', [
  '$scope', 
  '$state', 
  'User', 
  'PlaceFactory', 
  'ProfileFactory', 
  'userSession', 
  'CandidatesFactory',

  function($scope, $state, User, PlaceFactory, ProfileFactory, userSession, CandidatesFactory){

    $scope.fbId = User.fbid;
    $scope.username = User.name;
    $scope.notHost = {"checked": true};
    
    $scope.location = User.location || PlaceFactory.all();
    console.log("initial location ", $scope.location)

    $scope.toggleHost = function(status, input) {
      console.log('status pre click ', status);
      if(status === null) {
        $scope.location.host = input;
      } 
      else {
        $scope.location.host = null;
      }
    };

    $scope.savePreferences = function(){
      PlaceFactory.initialize($scope.location, User)
        .then(function(res) {
          console.log('Account: Place: response from database after saving ', res);
          User.location = res;
          CandidatesFactory.initialize(User);
        })
      $state.go('tab.account');
    };

    $scope.logout = function(){
        userSession.auth.$logout();
    };

  }]);
