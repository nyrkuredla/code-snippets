const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { getAllUsers, getAllSnippets, addUser, addSnippet, getUserById, getSnippetById } = require('../dal');
const User = require('../models/User');
const Snippet = require('../models/Snippet');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken')

router
  .route('/')
  .get(function (req, res) {
    getAllUsers().then(function (users) {
      res.render('users', {users})
    })
  })

router
  .route('/login')
  .get(function (req, res) {
    res.render('login')
  })
  .post(function (req, res) {
  User.findOne({ username: req.body.username }, '+password', function (
    err,
    user,
    next
  ) {
    if (err) return next(err)
    if (!user) {
      console.log('no user')
      return res.status(401).send({ message: 'Something went wrong...please try again.' })
    }
    user.comparePassword(req.body.password, user.password, function (
      err,
      isMatch
    ) {
      console.log('is match', isMatch)
      if (!isMatch) {
        console.log('password does not match')
        return res.status(401).send({ message: 'Something went wrong...please try again.' })
      }
      else {
      let myToken = jwt.sign({username: req.body.username}, 'stop right there criminal scum!')
      console.log(myToken);
      res.status(200).json(myToken);
    }
    })
  })
})

router
  .route('/addUser')
  .get(function (req, res) {
    res.render('add')
  })
  .post(function (req, res) {
    addUser(req.body).then(function(newUser) {
      console.log(req.body)
      res.render('login', {newUser})
    })
  })

module.exports = router
