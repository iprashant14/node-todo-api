
const {Users} = require('./../models/user');

var authenticate = (req,res,next) => {
  var token = req.header('x-auth');
  //console.log("TOKEN ",token);
  //console.log("Inside authenticate");
  Users.findByToken(token).then((user) => {
    if(!user){
      //console.log("Inside authenticate 2");
      return Promise.reject();
    }
    //console.log("USer ",user);
    req.user = user;
    //console.log(req.user);
    req.token = token;
    next();
  }).catch((e) => {
    return res.status(401).send();
  });

}

module.exports = {
  authenticate
}
