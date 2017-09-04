const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const userDal = require('./dal')
const routes = require('./routes/routes')
const session = require('express-session')
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
const {TOKEN_SECRET} = require('./config')
const moment = require('moment')

//'.mustache' expression linked to mustache express
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

//setting public folder
app.use(express.static('public'))

// setting up bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//setting up web tokens
app.use(expressJWT({ secret: TOKEN_SECRET }).unless({ path: ['/login', '/']}))

//establishing session parameters
app.use(session({
  secret: 'hush hush',
  resave: false,
  saveUninitialized: false
}))

//setting up validation
app.use(validator());

//setting log-in to be false unless successfully logged in
app.use(function (req, res, next) {
  if (req.session.usr) {
    req.isAuthenticated = true
  }
  else {
    req.isAuthenticated = false
  }
  next()
})

//routes
app.use('/', routes)

//setting port
app.set('port', 3000)
app.listen(app.get('port'), function() {
  console.log('Ready to go on port 3000!')
})
