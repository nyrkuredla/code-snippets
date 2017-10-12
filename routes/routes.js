//requires and variables
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { getAllUsers, getAllSnippets, addUser, addSnippet, getUserById, getSnippetById, getSnippetByAuth, getUserByUsername } = require('../dal');
const User = require('../models/User');
const Snippet = require('../models/Snippet');
const session = require('express-session')
// const expressJWT = require('express-jwt');
// const {TOKEN_SECRET} = require('../config')
// const jwt = require('jsonwebtoken')

//routes

router
  .route('/')
  .get(function (req, res) {
    res.redirect('/users')
  })

router
  .route('/users')
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
      return res.status(401).send({ message: 'Something went wrong...please try again.' })
    }
    user.comparePassword(req.body.password, user.password, function (
      err,
      isMatch
    ) {
      if (!isMatch) {
        console.log('password does not match')
        return res.status(401).send({ message: 'Something went wrong...please try again.' })
      }
      else {
        req.session.user = {
          username: user.username,
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          snippets: user.snippets
        }
        res.redirect('/profile');
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
      res.render('login', {newUser})
    })
  })

router
  .route('/profile')
  .get(function (req, res) {
   getUserByUsername(req.session.user.username).then(function (user) {
     getSnippetByAuth(user.id).then(function (snippets) {
       res.render('profile', {user: user, snippets: snippets})
         })
        })
      })

router
  .route('/addSnippet')
  .get(function (req, res) {
    res.render('add')
  })
  .post(function (req, res) {
    let user = req.session.user
    let newSnip = {
      author: user.id,
      title: req.body.title,
      snippet: req.body.snippet,
      language: req.body.language,
      tag: req.body.tag
    }
    addSnippet(newSnip).then(function (snippet) {
      res.redirect('/profile')
    })
  })

router
  .route('/snipLang/')
  .post(function (req, res) {
    console.log(req.body)
    Snippet.findByLanguage(req.body.language).then(function (snippets) {
      console.log('here are the snips', snippets)
      return res.render('profile', {snippets: snippets})
    })
  })

router
  .route('/snipTag')
  .post(function (req, res) {
    Snippet.findByTag(req.body.tag).then( (snippets) => {
      console.log('here are the snips', snippets)
      return res.render('profile', {snippets: snippets});
    })
  })

module.exports = router
