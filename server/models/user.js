var mongoose = require('mongoose');

var Users = mongoose.model('User', {
  email : {
    type : String ,
    required : true ,
    minlength : 1 ,
    trim : true
  }
});

module.exports = {
  Users
}

// var otherUser = new Users({
//   email : 'adasdasd@gmail.com'
// });
//
// otherUser.save().then((doc) => {
//   console.log(JSON.stringify(doc,undefined,4));
// },() => {
//   console.log("cannot save user");
// });
