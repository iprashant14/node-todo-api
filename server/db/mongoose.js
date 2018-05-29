var mongoose = require('mongoose');

mongoose.Promise = global.Promise ;
mongoose.connect('mongodb://iprashant14:Pp@mlab10!@ds239940.mlab.com:39940/ppdatabase'||'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}
