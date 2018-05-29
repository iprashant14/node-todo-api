const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5b0c318e19410a193c1e3407';

if(!ObjectID.isValid(id)){
  console.log('ID not Valid');
}

Todo.find({
  _id : id
}).then((todos) => {
  console.log('Todos',todos);
});

Todo.findOne({
  _id : id
}).then((todo) => {
  console.log('Todo',todo);
});

Todo.findById(id).then((todo) => {
  if(!todo){
    console.log("Id not found");
  }
  console.log('Todo by ID',todo);
}).catch((e) => console.log(e));
