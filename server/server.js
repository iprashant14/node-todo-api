require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {Todo} = require('./models/todo');
var {mongoose} = require('./db/mongoose');
var {Users} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var {ObjectID} = require('mongodb');

const port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos',authenticate ,(req,res) => {
  var todo = new Todo({
    text : req.body.text,
    _creator : req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos',authenticate ,(req,res) => {
  Todo.find({_creator : req.user._id}).then((todos) => {
    res.send({todos});
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id',authenticate,(req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    //console.log(id);
  Todo.findOne({
    _id : id,
    _creator : req.user._id
  }).then((todo) => {
    if(todo){
      return  res.status(200).send({todo});
    }
    else{
      return  res.status(404).send();
    }
  }).catch((e) => {
  return  res.status(400).send(e);
  });
});

app.delete('/todos/:id',authenticate,(req,res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)){
      return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id : id,
    _creator : req.user._id
  }).then((todo) => {
    if(!todo){
      return  res.status(404).send();
    }
    return  res.status(200).send({todo});
  }).catch((e) => {
    return  res.status(400).send(e);
  });

});

app.patch('/todos/:id',authenticate ,(req,res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  var body = _.pick(req.body,['text','completed']);

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }
  else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    {
      _id : id,
      _creator : req.user._id
    }
    , {$set : body},{new : true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(404).send();
  });

});

app.post('/users',(req,res) => {

  var body = _.pick(req.body,['email','password']);
  //console.log(body);
  var user = new Users(body);
  //console.log(user);
  user.save().then(() => {
    //res.status(200).send(user);
    return user.generateAuthToken();
  }).then((token) => {
    console.log(token);
    return res.header('x-auth',token).send(user);
  }).catch((e) => {
      res.status(400).send(e);
  });
});

app.get('/users/me',authenticate,(req,res) => {
    return res.send(req.user);
});

app.post('/users/login',(req,res) => {
  var body = _.pick(req.body,['email','password']);
  console.log(body);
  Users.findByCredentials(body.email,body.password).then((user) => {
    console.log("Before generateAuthToken");
    return user.generateAuthToken().then((token) => {
    console.log("after ",token);
    res.header('x-auth',token).send(user);
  }).catch((e) => {
    console.log("In catch");
    res.status(400).send();
  });
}).catch((e) => {
  console.log("In catch");
  res.status(400).send();
});
});

app.delete('/users/me/token',authenticate,(req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port,() => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
}
