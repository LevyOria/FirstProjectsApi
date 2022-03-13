const express= require("express");
const bcrypt = require("bcrypt");
const { validateUser, UserModel, validateLogin, genToken } = require("../models/userModel"); //import to fanction
const { auth } = require("../middlewares/atuh");
const router = express.Router();

router.get("/", (req,res) => {
  res.json({msg:"Users work ****"});
})

// Check if the token is still valid or reliable
router.get("/authUser", auth , async(req,res) => {
  res.json({status:"ok",msg:"token valid"})
})

router.get("/userInfo", auth , async(req,res) => {
  try{
    let data = await UserModel.findOne({_id:req.tokenData._id},{password:0})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err)
  }
  // Should return information of name, address
//Regarding the user
})

// Add a new user
router.post("/", async(req,res) => {
  let validBody = validateUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);//Security level
    await user.save();
    user.password = "******";//Returns password encryption
    res.status(201).json(user);
  }
  catch(err){
    if(err.code == 11000){ //Checks that there is no duplication in the email
      return res.status(400).json({code:11000,err_msg:"Email already in system try log in"})
    }
    console.log(err);
    res.status(500).json(err);
  }
})


router.post("/login", async(req,res) => {
  let validBody = validateLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email});//findOne ->Returns one object
    if(!user){
      return res.status(401).json({err_msg:"User/email not found in the system"});
    }

    let validPassword = await bcrypt.compare(req.body.password, user.password);//bcrypt compare-> the password from the body to the user
    if(!validPassword){
      return res.status(401).json({err_msg:"Password worng"});
    }
 
    let token = genToken(user._id)
    // {token} -> lthough we only wrote Token because there is also a variable in the name of the property then JavaScript knows to recognize
  //In a variable scope or parameter and it puts it into its property
    res.json({token});

    // In the end we will have to send a token to the user
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;