const express = require("express");
const router = express.Router();
const Airline = require('../models/airline');
const passport = require('passport');


function IsLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
// GET airline listing. 
router.get("/", IsLoggedIn, (req, res, next) => {
    Airline.find((err, airlines) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("airlines/index",
                {
                    title: "Airlines",
                    dataset: airlines,
                    user: req.user
                });
        }

    });
});

router.get('/add', IsLoggedIn, (req, res, next) => {
    res.render('airlines/add', { title: 'Add a new Airline', user: req.user  });
});

router.post('/add',IsLoggedIn, (req, res, next) => {
    Airline.create({
        airlineName: req.body.airlineName,
        airlineCode: req.body.airlineCode
    }, (err, newAirline) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/airlines');
        }
    });
});


module.exports = router;
