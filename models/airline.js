const mongoose = require('mongoose');

const airlineSchemaDefinition = {

    airlineName: {
        type: String,
        required: true
    },
    airlineCode: {
        type: String
    }
};

var airlinesSchema = new mongoose.Schema(airlineSchemaDefinition);


module.exports = mongoose.model('Airline', airlinesSchema);