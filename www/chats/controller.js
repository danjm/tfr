angular.module('chats.controllers', [])

.controller('ChatsCtrl', function($scope, User, Chats, MatchesFactory, userSession, $stateParams) {

  // We will have to refactor this controller and other parts of the app as to:
    // When a user A likes user B, we check if B already likes A
      // If so, its a match and the url for the firebase chat will already be stored with B's like data
      // If not, the url will have to be created at this time and stored with A's like data
    // Once this url is stored, scope.chat (which will only be defined in the case of matches)
    // will only need to take one parameter: the url for the firebase chat

  var matchId = $stateParams.matchId;
  console.log('match id in chats controller - ', $stateParams)
  
  $scope.match = MatchesFactory.get(matchId);
  $scope.existingChatURL = $scope.match.chatURL;
  // $scope.existingChatURL = "https://ionictestchat.firebaseio.com/10155475481120094499"
  $scope.matchChatURL = Chats.matchChatURL(userSession.user.id,matchId,$scope.existingChatURL);
  MatchesFactory.update(matchId,'chatURL',$scope.matchChatURL);
  console.log('$scope.matchChatURL',$scope.matchChatURL);
  $scope.chats = Chats.set($scope.matchChatURL);

  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
  $scope.add = function(message){
    Chats.add($scope.chats,User.name,message,User.fbid);
  }
});