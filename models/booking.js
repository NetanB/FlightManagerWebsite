 const mongoose = require('mongoose');


 const schemaDefinition = {

    name:{
        type: String,
        required: true
    },
    airline:{
        type: String,
        required: true
    },
    departureDate:{
        type: Date,
        required: true
    },
     departureAirport: {
         type: String,
         required: true
     },
    arrivalAirport:{
        type: String,
        required: true

    },
    flightNumber:{
        type: Number,
        required: true
    }


   
 };
var mongooseSchema = new mongoose.Schema(schemaDefinition);


module.exports = mongoose.model('Booking', mongooseSchema);