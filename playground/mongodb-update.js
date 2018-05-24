const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client) => {

  const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate({
    _id : new ObjectID('5b070704a18f4701f4e25d26')
  },{
    $set : {
      name : 'Katto'
    },
    $inc : {
      age : 1
    }

  },{
    returnOriginal : false
  }).then((result) => {
    console.log(result);
  });

});
