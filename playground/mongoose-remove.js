const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5b10e49a1071761a6a640ac0';

if(!ObjectID.isValid(id)){
  console.log('ID not Valid');
}

Todo.remove({}).then((result) => {
  console.log(result);
});

//findOneAndRemove

Todo.findOneAndRemove({_id : id}).then((todo) => {
  console.log(todo);
});

//findByIdAndRemove

Todo.findByIdAndRemove(id).then((todo) => {
  console.log(todo);
});
