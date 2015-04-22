angular.module('swipe.controllers', [])

.controller('SwipeController', function($scope, $timeout, CandidatesFactory, MatchesFactory, SkippedFactory, User) {

  $scope.candidates = CandidatesFactory.all();

  $scope.user = User

  $scope.currentCandidate = angular.copy($scope.candidates[0]);
  console.log("currentCandidate in swipe controller ", $scope.currentCandidate)

  $scope.$watch(
    function () { 
      return CandidatesFactory.getFirst();
    }, 
    function (firstCandidate) {
      $scope.currentCandidate = firstCandidate;
    }
  );

  $scope.candidateSwipe =  function (match, User){
    console.log('candidateSwipe',match);
    if (match) {
      $scope.currentCandidate.match = true;
      //Once server is up, this will be a POST request to the server
      User = MatchesFactory.add($scope.currentCandidate, $scope.user);
      MatchesFactory.saveAllMatches(User)
        .then(function(res){
          console.log("current user res from saveAllMatches", res);
          $scope.user = User = res;
        });
      MatchesFactory.updateMatchedUsers()
        .then(function(res) {
          console.log("last candidate from updateMatchedUsers ", res)
          // $scope.currentCandidate = res.data;
        })
    } else {
      //Perhaps we only need to do a PUT request to the server here?
      SkippedFactory.add($scope.currentCandidate);
    }

    $scope.currentCandidate.hide = true;
    CandidatesFactory.removeFirst();

  };

  //I don't like all the side effects here...
  // $scope.candidateSwipe =  function (match){

    

  //   if (match) {
  //     $scope.currentCandidate.match = true;
  //     //Once server is up, this will be a POST request to the server
  //     MatchesFactory.add($scope.currentCandidate);
  //   } else {
  //     //Perhaps we only need to do a PUT request to the server here?
  //     SkippedFactory.add($scope.currentCandidate);
  //   }

  //   $scope.currentCandidate.rated = match;
  //   $scope.currentCandidate.hide = true;

  //   $timeout(function(){
  //     // console.log("!!!!");
  //     CandidatesFactory.removeFirst();
  //     //$scope.currentCandidate = angular.copy($scope.candidates[0]);     
  //   }, 250);

  // };

})

