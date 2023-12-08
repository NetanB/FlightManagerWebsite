var checkAuthentication = require("./config/googleAuth.js");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var flightRouter = require('./routes/flights');
var bookingRouter = require('./routes/bookings');
var airlineRouter = require('./routes/airlines');


const config = require('./config/globals');

const mongoose = require('mongoose');
const passport = require('passport');
const githubStrategy = require('passport-github2').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;


const session = require('express-session');

var app = express();


app.use(session({
  secret: 'f2023Fl1ghtManag3r',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new googleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      passReqToCallback: true
    },
    async (accessToken, refreshToken, profile, done) => {
      //get the user data from google 
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
        email: profile.emails[0].value
      }

      try {
        //find the user in our database 
        let user = await User.findOne({ googleId: profile.id })

        if (user) {
          //If user present in our database.
          done(null, user)
        } else {
          // if user is not preset in our database save user data to database.
          user = await User.create(newUser)
          done(null, user)
        }
      } catch (err) {
        console.error(err)
        }
      }
    )
  )
app.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
}));

app.get("/sign/in", checkAuthentication, (req, res) => {
  res.redirect("/auth/google/success");
})

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/success',
  failureRedirect: '/auth/google/failure',
}));

app.get('/auth/google/success', (req, res) => {

  // create a session state named userDetail containg all info of userInfoVariable
  req.session.userDetail = userInfoVariable;

  res.redirect("/");
});

app.get('/auth/google/failure', (req, res) => {
  res.send("Welcome to failure page");
});

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  })



// Link passport to the user model
const User = require('./models/user');
passport.use(User.createStrategy());

// Configure passport-github2 with the API keys and user model
// We need to handle two scenarios: new user, or returning user
passport.use(new githubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackUrl
},
  // create async callback function
  // profile is github profile
  async (accessToken, refreshToken, profile, done) => {
    // search user by ID
    const user = await User.findOne({ oauthId: profile.id });
    // user exists (returning user)
    if (user) {
      // no need to do anything else
      return done(null, user);
    }
    else {
      // new user so register them in the db
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'Github',
        created: Date.now()
      });
      // add to DB
      const savedUser = await newUser.save();
      // return
      return done(null, savedUser);
    }
  }
));

// Set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use("/", express.static("./node_modules/bootstrap/dist/"));
app.use(
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/flights', flightRouter);
app.use('/bookings', bookingRouter);
app.use('/airlines', airlineRouter);


//config mongoose
mongoose
.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true})
.then((message)=>{
  console.log('connected Successfully!')
})
.catch((err) =>{
  console.log('error while connecting')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
