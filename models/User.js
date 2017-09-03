const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, select: false},
  name: {type: String, required: true},
  avatar: String,
  url: String,
  snippets: [{String}]
})

UserSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) {
    next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash
      user.updated_at = new Date().toISOString()
      next()
    })
  })
})

UserSchema.methods.comparePassword = (password, dbPass, done) => {
  bcrypt.compare(password, dbPass, (err, isMatch) => {
    done(err, isMatch)
  })
}

UserSchema.methods.comparePassword = function (pwd, dbPass, done) {
  // pwd = plain text
  bcrypt.compare(pwd, dbPass, (err, isMatch) => {
    done(err, isMatch)
  })
}

UserSchema.statics.findByUsername = function(username, cb) {
  return this.find({username: username})
}

const User = mongoose.model('User', UserSchema)

module.exports = User
