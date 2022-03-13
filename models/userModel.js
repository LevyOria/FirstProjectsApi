const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

let userSchema = new mongoose.Schema({//Pattern of schema
    name: String,
    email: String,
    password: String,
    address: String,
    phone: String,
    role:{
        type:String,
        default:"USER"
    },
    // Default of this date will be the date we created the record
    date_created: {
        type: Date,
        default: Date.now()
    }
})


//create models by using a schema
exports.UserModel = mongoose.model("users", userSchema); 


exports.genToken = (_id) => {// the function get the id of user
 //create token of the user 
 
    let token = jwt.sign({ _id }, `${config.tokenSecret}`, { expiresIn: "600mins" });
    return token;
}

exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
       
        // email - Checking the integrity of an email&password . required-> Requires sending
        email: Joi.string().min(2).max(150).email().required(), 
        password: Joi.string().min(3).max(100).required(),
        // allow null - Allows you to send an empty property
        address: Joi.string().min(2).max(150).allow(null, ""),
        phone: Joi.string().min(2).max(20).allow(null, "")
    })
    return joiSchema.validate(_reqBody);
}

// Validation to login
exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(100).required(),
    })
    return joiSchema.validate(_reqBody);
}