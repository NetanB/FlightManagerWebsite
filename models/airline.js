const mongoose = require('mongoose');

const airlineSchemaDefinition = {

    name: {
        type: String,
        required: true
    },
    airlineCode: {
        type: String,
        required: true
    }
};

var airlinesSchema = new mongoose.Schema(airlineSchemaDefinition);


module.exports = mongoose.model('Airline', airlinesSchema);