var db = require('./db/db.js'),
jwt  = require('jwt-simple');

module.exports = {
  signup: function (req, res) {
    db.once("userAdded", function(token){
      if(token){
        res.json({"token": token});
      }
      else{
        res.send(false);
     
      }
    });
    db.addUser(req.body);
  },
  login: function(req,res){
    db.once("userLogin", function(token){
      console.log("AuthController Login");
      if(token){
        res.json({'token': token});
      }else{
        res.send(false);      
      }
      return;
    });
    db.login(req.body);
  },
  logout: function(){},


  //if a user has signed in, they will have a token
  //this function tests if the user has a token
  //if the user has a token, the user is given 
  //access to the desired route
  authorize: function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      console.log("No Token Provided");
      res.send(false);
    } 
    else {
      var userName = jwt.decode(token, 'secret');
      db.once('foundUser', function(){
        db.tokenUser = userName;
        console.log("Authorized " + userName);
        next();
      });
      db.findUser(userName);
    }
  }
};

