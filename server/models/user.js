const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email : {
      type : String ,
      required : true ,
      minlength : 1 ,
      trim : true,
      unique : true ,
      validate : {
        validator : validator.isEmail,
        message : "{VALUE} is not a valid email"
      }
    },
    password : {
      type : String ,
      required : true ,
      minlength : 6
    },
    tokens : [{
      access : {
        type : String ,
        required : true
      },
      token : {
        type : String ,
        required : true
      }
    }]
  });

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();
  user.tokens = user.tokens.concat([{access,token}]);
  return user.save().then(() => {
  //  console.log("returning token ",token);
    return token;
  });
};

UserSchema.statics.findByToken = function(token) {
  var user = this;
  var decoded ;
  try{
    decoded = jwt.verify(token,process.env.SECRET);
  }catch(e){
    // return new Promise((resolve,reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return user.findOne({
    '_id' : decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email,password) {
  var user = this;
  //console.log("Cre ",email);
  return user.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }
    //console.log(user);
    return new Promise((resolve,reject) => {
      bcrypt.compare(password,user.password,(err,res) => {
        //console.log("sdfsdf",res);
        if(res)
        {
          //console.log(user);
          resolve(user);
          //console.log("After Resolve");
        }
        //console.log("Before Reject");
        reject();
      });

    });
  });
};

UserSchema.pre('save',function(next) {
    var user = this;
    if(user.isModified('password')){

      bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(user.password,salt,(err,hash) => {
          user.password = hash;
          //console.log("asdas",user.password);
          next();
        });
      });


    }
    else {
      next();
    }
});

UserSchema.methods.removeToken = function (token) {
  user = this ;
  return user.update({
    $pull : {
      tokens : { token }
    }
  });
}

var Users = mongoose.model('User', UserSchema);

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
