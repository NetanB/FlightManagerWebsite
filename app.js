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
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const githubStrategy = require('passport-github2').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;



var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'f2023Fl1ghtManag3r',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


const User = require('./models/user');
passport.use(User.createStrategy());

/*
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
*/

// Configure passport-github2 with the API keys and user model
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


// Set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/flights', flightRouter);
app.use('/bookings', bookingRouter);
app.use('/airlines', airlineRouter);


//config mongoose
//let connectionString = `mongodb+srv://${process.env.username}:${process.env.password}@cluster0.o0rnwhv.mongodb.net/FlightManagerAPI`;
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });
const hbs = require('hbs');
const e = require('express');
// function name and helper function with parameters
hbs.registerHelper('createOption', (currentValue, selectedValue) => {
  // initialize selected property
  var selectedProperty = '';
  // if values are equal set selectedProperty accordingly
  if (currentValue == selectedValue) {
    selectedProperty = 'selected';
  }
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
});

// helper function to format date values
hbs.registerHelper('toShortDate', (longDateValue) => {
  return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
