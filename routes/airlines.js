const express = require("express");
const router = express.Router();
const Airline = require('../models/airline');

// GET airline listing. 
router.get("/", (req, res, next) => {
    Airline.find((err, airlines) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("airlines/index",
                {
                    title: "Airlines",
                    dataset: airlines,
                });
        }

    });
});

router.get('/add', (req, res, next) => {
    res.render('airlines/add', { title: 'Add a new Airline' });
});

router.post('/add', (req, res, next) => {
    Airline.create({
        name: req.body.name
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
