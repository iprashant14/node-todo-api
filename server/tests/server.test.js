const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',() => {
  it('should create a new todo',(done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    })
  });

  it('should not create a todo with invalid data',(done) => {
    request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send({})
    .expect(400)
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    })
  });
});

describe('GET /todos', () => {
  it('should get all todos',(done) => {
    request(app)
    .get('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should get the specific todo',(done) => {
    console.log(`${todos[0]._id.toHexString()}`);
    console.log("X - Auth", users[0].tokens[0].token);
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should get return the todo created by specific user',(done) => {
    console.log(`${todos[1]._id.toHexString()}`);
    console.log("X - Auth", users[0].tokens[0].token);
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if todo not found',(done) => {
    var id = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${id}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should return 404 for non object ids',(done) => {

    request(app)
    .get(`/todos/123`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

});

describe('DELETE /todos/:id',() => {

  var hexId = todos[1]._id.toHexString();
  it('Should remove a todo',(done) => {
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth',users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeNull();
        done();
      }).catch((e) => done(e));
    });

  });

  it('Should remove not a todo created by other user',(done) => {
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeTruthy();
        done();
      }).catch((e) => done(e));
    });

  });


  it('should return a 404 if todo not found',(done) => {
      var hexId = new ObjectID().toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done)


  });

  it('should return a 404 if object id not found',(done) => {
    request(app)
    .delete(`/todos/123`)
    .set('x-auth',users[1].tokens[0].token)
    .expect(404)
    .end(done)
  });

});

describe('PATCH /todos/:id',() => {

  it('Should update the todo',(done) => {
      var hexId = todos[0]._id.toHexString();
      var text = 'This should be the new text';

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        completed : true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toEqual('number');
      })
      .end(done);
  });

  it('Should update the todo',(done) => {
      var hexId = todos[1]._id.toHexString();
      var text = 'This should be the new text';

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        completed : true,
        text
      })
      .expect(404)
      .end(done);
  });


  it('should clear completedAt when todo is not completed',(done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text2 !!!!';

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth',users[1].tokens[0].token)
    .send({
      completed : false,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeNull();
    })
    .end(done);

  });

});

describe('GET /users/me',() => {
  it('should return users if authenticated',(done) => {
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated',(done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});

describe('POST /users',() => {
  it('Should create a user',(done) => {
    var email = "ama4@gmail.com";
    var password = "asd123!";
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if(err){
        return done(err);
      }

      Users.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        console.log("asdasd",user.password);
        expect(user.password).not.toBe(password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation errors if request invalid',(done) => {
    var email = "asdasd";
    var password = "1234";
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });

  it('Should not create a user if already present',(done) => {
    var email = "i@gmail.com";
    var password = "userOnePass";
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);

  })

});

describe('POST /users/login',() => {

  it('should login user and return auth token',(done) => {
    var email = users[1].email;
    var password = users[1].password;
    //console.log("asfdas   ",email,password);
    request(app)
    .post('/users/login')
    .send({email,
          password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Users.findById(users[1]._id).then((user) => {
        expect(user.tokens[1]).toMatchObject({
          access:'auth',
          token : res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid login',(done) => {
    var email = users[1].email;
    var password = users[1].password+'123';
    //console.log("asfdas   ",email,password);
    request(app)
    .post('/users/login')
    .send({email,
          password
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Users.findById(users[1]._id).then((user) => {
        console.log("1");
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));
    });

  });

});

describe('DELETE /users/me/token',() => {
  it('should remove auth token on logout',(done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res) => {
      if(err){
        return done(err);
      }
      Users.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));

    });
  });
});
