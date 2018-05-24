//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);
// var user = {name : 'Prashant',age:24};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {

  if(err){
    return console.log("Unable to connect to mongodb server");
  }
  console.log("Successfully connected to mongodb server");

  const db = client.db('TodoApp');

  db.collection('Todos').find({text : 'Bahubali'}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs,undefined,4));
  },(err) => {
    console.log("Unable to fetch Todos ",err);
  });
//  client.close();
  db.collection('Todos').find().count().then((count) => {
    console.log("Todos Count : ",count);
  },
  (err) => {
    console.log("Unable to fetch Todos ",err);
  });

});
