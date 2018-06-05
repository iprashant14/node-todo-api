const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id : 10
};

const token = jwt.sign(data,'abc123');
console.log(token);
const decode = jwt.verify(token+'123','abc123');
console.log(decode);
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
