//pulling in user and snippet schema from model files
const User = require('./models/User')
const Snippet = require('./models/Snippet')

//setting up mongoose and bluebird
const mongoose = require('mongoose')
const bluebird = require('bluebird')
mongoose.connect('mongodb://localhost/snippets');

//getting all users from db
function getAllUsers () {
  return User.find()
}

//getting all snippets from db
function getAllSnippets () {
  return Snippet.find()
}

//getting user by username
function getUserByUsername (username) {
  return User.findOne({ "username": username })
}

//getting user by ID#
function getUserById (userId) {
  return User.findOne({ "_id": userId})
}

//getting snippet by ID#
function getSnippetById (snippetId) {
  return Snippet.findOne({ "_id": snippetId})
}

//adding new snippet to db
function addSnippet (newSnippet) {
  const snippet = new Snippet(newSnippet)
  snippet.save(function (err) {
    console.log(err)
  })
  console.log("New snippet added!")
  return Promise.resolve("success")
}

//adding new user to db
function addUser (newUser) {
  const user = new User(newUser)
  user.save(function (err) {
    console.log(err)
  })
  console.log("New user added!")
  return Promise.resolve("success")
}

//exporting functions
module.exports = {
  getAllUsers, getAllSnippets, addUser, addSnippet, getUserById, getSnippetById, getUserByUsername
}
