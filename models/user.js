const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
  email: String,
  username: String,
  password: String
},{
  timestamps: {
  createdAt: 'createdAt',
  updateddAt: 'updateddAt'
  }
});


const User = mongoose.model('user', userSchema);
module.exports = User;
module.exports.hashPassword = async(password) => {
  try{
    const salt = await bcypt.genSalt(10);
    return await bcypt.hash(password,salt);
  } catch(error){
    throw new Error('Hashing failed', error);
  }
};

//module.exports.comparePasswords = async (inputPassword, hashPassword) => {  
//  try {
//    return user = await bcypt.compare(inputPassword, hashPassword);
//  } catch(error) {
//    throw new Error('Comparing failed',error);
//  }
//
//};


