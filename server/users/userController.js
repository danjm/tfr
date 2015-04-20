var Users = require('./userModel.js');
var Q = require('q');

module.exports = {
  
  getCandidates: function(req, res) {
    var findCandidates = Q.nbind(Users.find, Users);
    var latitude = req.param('lat');
    var longitude = req.param('longt');
    var radius = req.param('radi')*1.6/6370;
    var findUser = Q.nbind(Users.findOne, Users);
    findCandidates({
      loc: {$nearSphere: [latitude,longitude],$maxDistance: radius},
      fbid: {$ne: ""+req.params.id}})

    .then(function(data){
      //console.log('getCandidates:',data);
      res.send(data);
    })
  },

  /////////////////HAVING TROUBLE WITH FINDING OBJECT IDS//////////
  ///////////////TRYING TO USE THIS CODE IN THE ABOVE FUNCTION////////
  // findUser({fbid: req.params.id})
  //   .then(function(user) {
  //     console.log("user found when getting candidates ", user)
  //     findCandidates({
  //       $and: [{
  //         $or: [{"location.myPlace.city": req.params.location}, {"location.desiredPlace.city": req.params.location}]
  //       }, {
  //         _id: {$ne: {$in: user.matched}}
  //       }, {
  //         _id: {$ne: user.id}
  //       }]
  //     })
  //     .then(function(data){
  //       console.log("candidates ", data)
  //       res.send(data);
  //     })
  //   })
  addOrFindCurrentUser: function(req, res) {
    var findOrCreate = Q.nbind(Users.findOneAndUpdate, Users);
    if(req.body.location){
      var latitude = req.body.location.desiredPlace.latitude;
      var longitude = req.body.location.desiredPlace.longitude;
    } else {
      var latitude = 0;
      var longitude = 0;
    }
    console.log("id:",req.params.id);
    findOrCreate(
      {fbid: req.params.id}, 
      {$setOnInsert: {
        loc: [latitude,longitude],
        fbid: req.params.id, 
        name: req.body.name,
        profile: req.body.profile,
        location: req.body.location,
        roommatePreferences: req.body.roommatePreferences,
        liked: req.body.liked
        }
      },
      {upsert: true, new: true}
    )
    .then(function(user) {
      console.log("user from db in post ", user)
      res.send(user);
    });
  },

  updateProfile: function(req, res) {
    var findOrCreate = Q.nbind(Users.findOneAndUpdate, Users);
    console.log("params in updateProperty ", req.params)
    findOrCreate(
      {fbid: req.params.id }, 
      {$set: {profile: req.body.profile}},
      {upsert: true, new: true}
    )
    .then(function(user){
      res.send(user);
    });
  }, 

  updateLocation: function(req, res) {
    var findOrCreate = Q.nbind(Users.findOneAndUpdate, Users);
    var latitude = req.body.location.desiredPlace.latitude;
    var longitude = req.body.location.desiredPlace.longitude;
    findOrCreate(
      {fbid: req.params.id }, 
      {$set: {loc:[latitude,longitude],location: req.body.location}},
      {upsert: true, new: true}
    )
    .then(function(user){
      res.send(user);
    });
  },

  updateRoommatePreferences: function(req, res) {
    var findOrCreate = Q.nbind(Users.findOneAndUpdate, Users);
      findOrCreate(
        {fbid: req.params.id }, 
        {$set: {roommatePreferences: req.body.roommatePreferences}},
        {upsert: true, new: true}
      )
      .then(function(user){
        res.send(user);
      });
  },

  getMatches: function(req, res) {
    console.log("request to getMatches ", req.params)
    var findUser = Q.nbind(Users.findOne, Users);
    var findMatches = Q.nbind(Users.find, Users);
    
    findUser({fbid: req.params.id})
      .then(function(user){
        findMatches({_id: {$in: user.matched}})
          .then(function(matches) {
            console.log("matches", matches)
            res.send(matches);
      })
    })
  }
};





















