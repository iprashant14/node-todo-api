var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text : {
    type : String,
    required : true ,
    minlength : 1 ,
    trim : true
  },
  completed : {
      type : Boolean ,
      default : false
  },
  completedAt : {
    type : Number ,
    default : null
  },
  _creator : {
    type : mongoose.Schema.Types.ObjectId ,
    required : true
  }
});

module.exports = {Todo} ;


// var newTodo = new Todo({
//   text : 'Cook Dinner'
// });
//
// newTodo.save().then((doc) => {
//   console.log("Saved Todo ",doc);
// },(e) => {
//   console.log("Unable to save todo ",e);
// });

// var otherTodo = new Todo ({
//   text : ':)',
// });
//
// otherTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc,undefined,4));
// },(e) => {
//   console.log("Cannot save doc ",e);
// });
