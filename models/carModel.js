const Joi = require("joi");
const mongoose = require("mongoose");

let carSchema = new mongoose.Schema({//Pattern of schema
    company: String,
    model: String,
    year: Number,
    category:String,
    price: Number,
    color: String,
    info: String,
   img_url: String,
   user_id:String,
    // Default of this date will be the date we created the record
    date_created: {
        type: Date,
        default: Date.now()
    }
})

//create models by using a schema
exports.CarModel = mongoose.model("cars", carSchema); 

exports.validateCar = (_reqBody) => {
    let joiSchema = Joi.object({
      company:Joi.string().min(2).max(99).required(),
      model:Joi.string().min(2).max(99).required(),
      year:Joi.number().min(1950).max(2023).required(),
      category:Joi.string().min(2).max(99).required(),
      price:Joi.number().min(2).max(999999).required(),
      color:Joi.string().min(3).max(500).allow(null,""),
      info:Joi.string().min(3).max(500).allow(null,""),
      img_url:Joi.string().min(3).max(500).allow(null,""),
    })
    return joiSchema.validate(_reqBody)
  }