const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  username: {type: String, required; true},
  password: {type: String, select: false}
})

UserSchema.pre('save', function(next){
  const user = this;
  if(!user.isModified('password')){
    next()
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      user.updated_at = new Date().toISOString();
      next();
    })
  })
})

UserSchema.methods.comparePassword = function(pwd, dbPass, done) {
  bcrypt.compare(pwd, dbPass, (err, isMatch) +> {
    done(err, isMatch)
  })
}

UserSchame.statics.findByUsername = function(username, cb) {
  return this.find({username: username})
}

const User = mongoose.model('User', UserSchema)

module.exports = User
