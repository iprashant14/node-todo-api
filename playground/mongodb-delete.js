
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {

  if(err){
    return console.log('Unable to connect to mongodb server');
  }

  console.log('Successfully connected to mongodb server');

  const db = client.db('TodoApp');

  //delete many

  // db.collection('Todos').deleteMany({text : 'Eat lunch'}).then((result) => {
  //   console.log(result);
  //});

  //delete one
  // db.collection('Todos').deleteOne({text : 'Eat lunch'}).then((result) => {
  //     console.log(result);
  // });

  //findone and delete

  db.collection('Users').deleteMany({_id : new ObjectID('5b0701d7a18f4701f4e25c4a')}).then((result) => {
    console.log(result);
  });


});
