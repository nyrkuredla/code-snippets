//requires and variables
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { getAllUsers, getAllSnippets, addUser, addSnippet, getUserById, getSnippetById, getUserByUsername } = require('../dal');
const User = require('../models/User');
const Snippet = require('../models/Snippet');
// const expressJWT = require('express-jwt');
// const jwt = require('jsonwebtoken')


//protected route middleware - commented out for now, see notes in line 91 or in user profile route
// function ensureToken (req, res, next) {
//   const bearerHeader = req.headers["authorization"];
//   if (typeof bearerHeader !== 'undefined') {
//     const header = bearerHeader.split(' ');
//     const bearerToken = header[1];
//     req.token = bearerToken;
//     next();
//   }
//   else {
//     res.status(403);
//   }
// }

//routes

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
        //commenting out json web token stuff for now
        // let myToken = jwt.sign({username: req.body.username}, 'super_secret')
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
      console.log(req.body)
      res.render('login', {newUser})
    })
  })

router
  .route('/profile')
  //should have ensureToken middleware for json verification but commenting out for now
  .get(function (req, res) {
    console.log(req.body)
    res.send('yay')
  })
//   .get(ensureToken, function (req, res) {
//
//     //For some reason having a problem with verifying the token; even though it console-logs as having been set in the login path, and I've got the scripts set up in the main.js file to pull into the submit button to post to the login route, for some reason it isn't 'sticking'. Also, having a problem wherein *all* of the routes need a token even though the middleware is only defined on a few. comenting out all json web stuff for now so I can keep building.
//
//     console.log(req.token)
//     jwt.verify(req.token, 'super_secret', function (err, data) {
//       if (err) {
//         console.log(err);
//         res.status(403);
//       }
//       else {
//         console.log(data)
//         console.log(data.username)
//         let username = data.username;
//         getUserByUsername(username).then(function (user) {
//           res.render('profile', {user})
//         })
//       }
//   })
// })

router
  .route('/addSnippet')
  .get(function (req, res) {
    res.render('add')
  })
  .post(function (req, res) {
    addSnippet(req.body).then(function (snippet) {
      res.render('profile', {user})
    })
  })

router
  .route('/snipLang')
  .post(function (req, res) {
    Snippet.findByLanguage(req.body).then(function (snippets) {
      res.render('profile', {title: 'Find Snippets By Language'}, {snippets})
    })
  })

router
  .route('/snipTag')
  .post(function (req, res) {
    Snippet.findByTag(req.body).then(function (snippets) {
      res.render('profile', {title: 'Find Snippets By Tag'}, {snippets})
    })
  })

module.exports = router
