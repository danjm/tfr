//Can we reuse the initialize functions?
//Can we reuse the all functions?

angular.module('data', [])

.factory('MatchesFactory', function(){

  var matches = [];

  //Possibly too much repetition/redundancy with CandidatesFactory
  return {
    initialize: function(usersMatches){
      matches = usersMatches;
    },
    all: function() {
     return matches;
    },
    remove: function(match) {
      matches.splice(matches.indexOf(match), 1);
    },
    get: function(matchId) {
      console.log("matches in matchfact.get ", matches)
      console.log("matchId in matches fact ", matchId)
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].fbid === parseInt(matchId)) {
          return matches[i];
        }
      }
      return null;
    },
    update: function(matchId,property,newValue){
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].id === parseInt(matchId)) {
          matches[i][property] = newValue;
        }
      }
    },
    add: function(match){
      console.log("Match in matchfact add ", match)
      if(match.likedCurrentUser){
        console.log("and match.likecurrentuser")
        matches.push(match);
      }
    }
  };

})


//Outstanding question: Should be just handle those 'skipped' ('disliked') on 
//the backend?
//Do we need this list on the front end?
//... probably not...
.factory('SkippedFactory', function(){

  var skipped = [];

  return {
    initialize: function(usersSkipped){
      skipped = usersSkipped;
    },
    all: function() {
      return skipped;
    },
    add: function(skip){
      skipped.push(skip);
    },
    getFirst: function() {
      return skipped[0];
    } 
  };

})

.factory('ProfileFactory', function($http){

  //???Should we make myPlace a separate object accessed through a separate factory?
  //???Or should we make myPlace properties direct properties of profile?
  //???Current approach means we have to update the whole object to update any myPlace property?
  //???But maybe we would only ever update all properties at once?
  var profile = {
    gender: null,
    age: null,
    keywords: ['','','','','']
  };

  var baseUrl = 'http://localhost:8888';

   //???How best to remove the redundancy in lines 86-99 and lines 107-120?
  return {
    initialize: function(usersProfile, User){
      //console.log("!",usersProfile);
      // profile = usersProfile;
      return $http({
        method: 'PUT',
        url: baseUrl + '/user/' + User.fbid + '/profile',
        data: {
          profile: usersProfile
        }
      })
      .then(function(res) {
        console.log('Profile Factory Data - ', res);
        profile = res.data.profile;
        return res.data.profile;
      })    
    },
    all: function() {
      return profile;
    },
    update: function(property,newValue) {
      profile[property] = newValue;
    },
    getProperty: function(property) {
      return profile[property];
    },
  };

})

.factory('PlaceFactory', function($http){
  
  //???What is the difference between myplace here and myplace in profile factory?
  var location = { 
    host: null,
    myPlace: {
      rent: null,
      zipCode: null,
      genders: null,
      openRooms: null,
      roomType: null,
      occupants: null,
      city: null,
      state: null,
      latitude: null,
      longitude: null
    },
    desiredPlace:{
      rent: null,
      zipCode: null,
      radius: null,
      roomType: null,
      latitude: null,
      longitude: null,
      city: null,
      state: null
    }
  };



  var baseUrl = 'http://localhost:8888'

  //How best to remove the redundancy in lines 86-99 and lines 107-120?
  return {
    initialize: function(userLocation, User){
      console.log('How the hell can this not get to the server - ', userLocation);
      return $http({
        method: 'PUT',
        url: baseUrl + '/user/' + User.fbid + '/location',
        data: {
          location: userLocation
        }
      })
      .then(function(res){
        console.log("place factory res from db ", res)
        location = res.data.location;
        return res.data.location;
      })
    },
    all: function() {
      return location;
      // return $http({
      //   method: 'GET',
      //   url: baseUrl + '/user/' + User.fbid + '/location'
      // })
      // .then(function(data){
      //   console.log('data in placefactory get - ', data);
      //   return data;
      // })
    },
    update: function(property,newValue) {
      location[property] = newValue;
    },
    getProperty: function(property) {
      return location[property];
    },
  };

})

.factory('RoommateFactory', function($http){

  var baseUrl = 'http://localhost:8888'

  var roommatePreferences = {
    gender: null,
    ageMin: null,
    ageMax: null
  };

  //How best to remove the redundancy in lines 86-99 and lines 107-120?
  return {
    initialize: function(preference, User){
      // roommatePreferences = preference;
      return $http({
        method: 'PUT',
        url: baseUrl + '/user/' + User.fbid + '/roommatePreferences',
        data: {
          roommatePreferences: preference
        }
      })
      .then(function(res) {
        console.log('Roommate Factory Data - ', res);
        roommatePreferences = res.data.roommatePreferences;
        return res.data.roommatePreferences;
      })    
    },
    all: function() {
      return roommatePreferences;
    },
    update: function(property,newValue) {
      roommatePreferences[property] = newValue;
    },
    getProperty: function(property) {
      return roommatePreferences[property];
    },
  };

})


// https://Fauth.firebase.com%2Fv2%2Ftinderforroomies%2Fauth%2Ffacebook%2Fcallback
.factory('CandidatesFactory', function($http, $rootScope){

  var baseUrl = 'http://localhost:8888'

  var candidates = [];
  // var candidates = [{
  //   fbid: 0,
  //   name: 'Daniel Miller',
  //   face: 'img/faceDaniel.png',
  //   email: 'djmiller@gmail.com',
  //   chatURL: 'https://ionictestchat.firebaseio.com/10155475481120094499',
  //   match: false,
  //   likedCurrentUser: true,
  //   location: { 
  //     host: true,
  //     myPlace: {
  //       rent: 750,
  //       zipCode: null,
  //       genders: 'both',
  //       openRooms: 1,
  //       roomType: 'private',
  //       occupants: 3,
  //       city: 'Berkeley',
  //       state: 'CA',
  //       latitude: 37.867044,
  //       longitude: -122.250559
  //     },
  //     desiredPlace:{
  //       rent: null,
  //       zipCode: null,
  //       radius: null,
  //       roomType: null,
  //       latitude: null,
  //       longitude: null,
  //       city: null,
  //       state: null
  //     }
  //   },
  //   roommatePreferences: {
  //     gender: 'male',
  //     ageMin: 21,
  //     ageMax: 30
  //   },
  //   profile: {
  //     gender: 'male',
  //     age: 27,
  //     keywords: ['peaceful','cake','beer','wine','cheese']
  //   },
  //   liked: ["552eabd2a2d7560782cabdef"]
  // }, {
  //   fbid: 1,
  //   name: 'Dick Rogers',
  //   face: 'img/face1.png',
  //   email: 'dickrodgers@test.com',
  //   match: false,
  //   likedCurrentUser: false,
  //   location: { 
  //     host: true,
  //     myPlace: {
  //       rent: null,
  //       zipCode: null,
  //       genders: null,
  //       openRooms: null,
  //       roomType: null,
  //       occupants: 3,
  //       city: null,
  //       state: null,
  //       latitude: null,
  //       longitude: null
  //     },
  //     desiredPlace:{
  //       rent: 900,
  //       zipCode: null,
  //       radius: 3,
  //       roomType: 'private',
  //       latitude: 37.79730575499309,
  //       longitude: -122.41619110107422,
  //       city: 'Berkeley',
  //       state: 'CA'
  //     }
  //   },
  //   roommatePreferences: {
  //     gender: 'male',
  //     ageMin: 21,
  //     ageMax: 30
  //   },
  //   profile: {
  //     gender: 'male',
  //     age: 27,
  //     keywords: ['rowdy','beer','cookies','football','cheese whiz']
  //   },
  //   liked: ["552eabd2a2d7560782cabdef"]
  // }, {
  //   fbid: 2,
  //   name: 'Thick McStevens',
  //   face: 'img/face2.png',
  //   email: 'thicksteve@test.com',
  //   match: false,
  //   likedCurrentUser: true,
  //   location: { 
  //     host: false,
  //     myPlace: {
  //       rent: 750,
  //       zipCode: null,
  //       genders: 'both',
  //       openRooms: 1,
  //       roomType: 'private',
  //       occupants: 3,
  //       city: 'Berkeley',
  //       state: 'CA',
  //       latitude: 37.867044,
  //       longitude: -122.250559
  //     },
  //     desiredPlace:{
  //       rent: 250,
  //       zipCode: null,
  //       radius: 5,
  //       roomType: null,
  //       latitude: 37.867045,
  //       longitude: -122.250560,
  //       city: 'Berkeley',
  //       state: 'CA'
  //     }
  //   },
  //   roommatePreferences: {
  //     gender: 'male',
  //     ageMin: 21,
  //     ageMax: 30
  //   },
  //   profile: {
  //     gender: 'male',
  //     age: 27,
  //     keywords: ['peaceful','cake','beer','wine','cheese']
  //   },
  //   liked: []
  // }, {
  //   fbid: 3,
  //   name: 'Jim Carrey',
  //   face: 'img/face3.jpeg',
  //   email: 'jimcarrey@test.com',
  //   match: false,
  //   likedCurrentUser: true,
  //   location: { 
  //     host: true,
  //     myPlace: {
  //       rent: 750,
  //       zipCode: null,
  //       genders: 'both',
  //       openRooms: 1,
  //       roomType: 'private',
  //       occupants: 3,
  //       city: 'Berkeley',
  //       state: 'CA',
  //       latitude: 37.867044,
  //       longitude: -122.250559
  //     },
  //     desiredPlace:{
  //       rent: null,
  //       zipCode: null,
  //       radius: null,
  //       roomType: null,
  //       latitude: null,
  //       longitude: null,
  //       city: null,
  //       state: null
  //     }
  //   },
  //   roommatePreferences: {
  //     gender: 'male',
  //     ageMin: 21,
  //     ageMax: 30
  //   },
  //   profile: {
  //     gender: 'male',
  //     age: 27,
  //     keywords: ['Chiller','Smoker','beer','wine','cheese']
  //   },
  //   liked: ["552eabd2a2d7560782cabdef"]
  // }, {
  //   fbid: 4,
  //   name: 'Max Howser',
  //   face: 'img/face5.jpeg',
  //   email: 'maxhowser@test.com',
  //   match: false,
  //   likedCurrentUser: true,
  //   location: { 
  //     host: true,
  //     myPlace: {
  //       rent: 750,
  //       zipCode: null,
  //       genders: 'both',
  //       openRooms: 1,
  //       roomType: 'private',
  //       occupants: 3,
  //       city: 'Reno',
  //       state: 'NV',
  //       latitude: 39.49556336059472,
  //       longitude: -119.805908203125
  //     },
  //     desiredPlace:{
  //       rent: null,
  //       zipCode: null,
  //       radius: null,
  //       roomType: null,
  //       latitude: null,
  //       longitude: null,
  //       city: null,
  //       state: null
  //     }
  //   },
  //   roommatePreferences: {
  //     gender: 'male',
  //     ageMin: 21,
  //     ageMax: 30
  //   },
  //   profile: {
  //     gender: 'male',
  //     age: 27,
  //     keywords: ['Nuts','Crazy','Wild','Hateful','Bad']
  //   },
  //   liked: ["552eabd2a2d7560782cabdef"]
  // }, {
  //   fbid: 5,
  //   name: 'Zack Thompson',
  //   face: 'img/face4.jpeg',
  //   email: 'zackthompson@test.com',
  //   match: false,
  //   likedCurrentUser: true,
  //   location: { 
  //     host: true,
  //     myPlace: {
  //       rent: 750,
  //       zipCode: null,
  //       genders: 'both',
  //       openRooms: 1,
  //       roomType: 'private',
  //       occupants: 3,
  //       city: 'Berkeley',
  //       state: 'CA',
  //       latitude: 37.86509663749013,
  //       longitude: -122.2639274597168
  //     },
  //     desiredPlace:{
  //       rent: null,
  //       zipCode: null,
  //       radius: null,
  //       roomType: null,
  //       latitude: null,
  //       longitude: null,
  //       city: null,
  //       state: null
  //     }
  //   },
  //   roommatePreferences: {
  //     gender: 'male',
  //     ageMin: 21,
  //     ageMax: 30
  //   },
  //   profile: {
  //     gender: 'female',
  //     age: 24,
  //     keywords: ['Books','Dogs','Fitness','Fun','Nature']
  //   },
  //   liked: ["552eabd2a2d7560782cabdef"]
  // }];
  // //Possibly too much repetition/redundancy with MatchesFactory
  return {
    initialize: function(req){
      // if(candidates.length>0){
      //   return;
      // }
      if (!req.location) {
        console.log("not grabbing candidates yet! need to set search prefs")
      } else if (req.location.host) {
        return $http({
          method: 'GET',
          url: baseUrl + '/user/' + req.fbid + '/' + req.location.myPlace.city
        })
        .then(function(res) {
          console.log("candidates that match location ", res)
          candidates = res.data;
          // return candidates;
        })
      } else {
        var lat = req.location.desiredPlace.latitude;
        var longt = req.location.desiredPlace.longitude;
        var radi = req.location.desiredPlace.radius
        return $http({
          method: 'GET',
          url: baseUrl + '/user/' + req.fbid + 
              '/location?lat=' + lat + '&longt=' + longt + '&radi=' + radi
        })
        .then(function(res) {
          console.log("candidates that match location ", res.data)
          candidates = res.data;
          // return candidates;  
        })
      }
    },

    all: function() {
      console.log("Candidates: getting all candidates")
      return candidates;
    },


      // console.log('You called candidate factory\'s all method');
     // return candidates
    removeFirst: function() {
      candidates.splice(0, 1);
    },
    getFirst: function() {
      return candidates[0];
    },
    add: function(candidate){
      candidates.push(candidate);
    },
    mock: function(){
      // candidates.forEach(function(candidate){
        // console.log('mock candidate being sent to server ', candidate)
        return $http({
          method: 'PUT',
          url: baseUrl + '/user/' + candidates[1].id,
          data: {
            candidate: candidates[1],
          }
        })
        .then(function(res){
          console.log("place factory res from db ", res)
          return res.data.location;
        })
    },
    candidates: candidates
  };

})

  // Dummy Data all moved to tests/data/CandidatesFactory.tests.js
