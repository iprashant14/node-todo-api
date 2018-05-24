//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
var user = {name : 'Prashant',age:24};

var {name} = user;
console.log(name);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {

  if(err){
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Successfully connected to mongodb server");

  const db = client.db('TodoApp');
  // db.collection('Todos').insertOne({
  //   text : 'Something to do ',
  //   coompleted : false
  // },(err,result) => {
  //   if(err)
  //     return log("Unable to insert todo ",err);
  //   console.log(JSON.stringify(result.ops,undefined,4));
  // });

  // db.collection('Users').insertOne({
  //   name : 'Prashant',
  //   age : 24,
  //   location : 'Noida'
  // },(err,result) => {
  //   if(err)
  //     return log("Unable to insert user ",err);
  //   console.log(JSON.stringify(result.ops,undefined,4));
  //   console.log("Timestamp of object id ",result.ops[0]._id.getTimestamp());
  // });


  client.close();
});
