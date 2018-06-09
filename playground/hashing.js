const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "123456!";

// bcrypt.genSalt(10,(err,salt) => {
//   bcrypt.hash(password,salt,(err,hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$qPKeCgf8B5/Rc5/lwSXd7OgVpeZem2YjU.MIOKGap2GR.ae/7EnuC';
bcrypt.compare(password,hashedPassword,(err,res) => {
  console.log(res);
});
// var data = {
//   id : 10
// };
//
// const token = jwt.sign(data,'abc123');
// console.log(token);
// const decode = jwt.verify(token+'123','abc123');
// console.log(decode);
// var message = "I am user number 4";
// var hash = SHA256(message).toString();
//
// console.log(`message --- ${message}`);
// console.log(`Hash of message === ${hash}`);
//
// var data = {
//   id : 4
// };
//
// var token = {
//   data,
//   hash : SHA256(JSON.stringify(data) + 'Secret').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data)+'Secret').toString();
// if(resultHash == token.hash){
//   console.log("Data not changed");
// }else{
//   console.log("Data was changed. Do not trust!!!");
// }

//YE SAB SEEKHNE KE LIYE THA JWT mei saab implemented h!
