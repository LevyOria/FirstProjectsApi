

const mongoose = require('mongoose'); //connect to mongo 
const { config } = require('../config/secret'); //user and password to login mongo db atlas

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://${config.userMongo}:${config.passMongo}@cluster0.5wnam.mongodb.net/projectkoko


    `);
    console.log("Mongo Atlas connect...") // Password and username authentication and sending by sending
}
