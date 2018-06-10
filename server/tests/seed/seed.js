
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {Users} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    '_id' : userOneId,
    email : 'i@gmail.com',
    password : 'userOnePass',
    tokens : [{
      access : 'auth',
      token : jwt.sign({_id:userOneId,access: 'auth'},process.env.JWT_SECRET).toString()
    }]
  },{
    '_id' : userTwoId,
    email : 'i2@gmail.com',
    password : 'userTwoPass',
    tokens : [{
      access : 'auth',
      token : jwt.sign({_id:userTwoId,access: 'auth'},process.env.JWT_SECRET).toString()
    }]

  }];

const todos = [{
  _id : new ObjectID(),
  text : 'First test todo',
  _creator : userOneId
},{
  _id : new ObjectID(),
  text : 'Second test todo',
  completed : true ,
  completedAt : 333,
  _creator : userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

const populateUsers = (done) => {
  Users.remove({}).then(() => {
    var userOne = new Users(users[0]).save();
    var userTwo = new Users(users[1]).save();

    return Promise.all([userOne,userTwo]);
  }).then(() => done());
}

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
