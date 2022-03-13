const express = require("express");
const { auth } = require("../middlewares/atuh");
const { CarModel, validateCar } = require("../models/carModel");
const router = express.Router();

router.get("/", async(req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    try{
        let data = await CarModel.find({})
        .limit(perPage)
        .skip((page-1)*perPage)
       res.json(data)

    }
    catch(err){
        console.log(err);
    res.status(500).json({msg_err:"There problem in server try again later"}) 


    }
})

router.get("/cat/:catname", async(req, res) => {
    try {
        let perPage = req.query.perPage || 10;
        let page = req.query.page || 1;
        let catname = new RegExp(req.params.catname, "i");
        let data = await CarModel.find({ category: catname })
            .limit(perPage)
            .skip((page - 1) * perPage)
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg_err: "There problem in server try again later" })
    }

})


router.get("/search", async(req,res) => {
    try{
      let searchQ = req.query.s;
      let searchReg = new RegExp(searchQ,"i")
      let data = await CarModel.find({$or:[{company:searchReg},{info:searchReg}]})
      .limit(20)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg_err:"There problem in server try again later"})
    }
  })
//need a token
router.post("/", auth,async(req,res)=>{

    let validBady =validateCar(req.body);
    if(validBady.error){
        return res.status(400).json(validBady.error.details)
    }
    try{ let car = new CarModel(req.body);
        car.user_id=req.tokenData._id;
        await car.save();
        res.status(201).json(car);
}
catch(err){
    console.log(err)
}

})

router.delete("/:delId",auth,async(req,res) => {
    try{
      let idDel = req.params.delId;
      let data = await CarModel.deleteOne({_id:delId, user_id:req.tokenData._id});
      // countDelted: 1 
      res.json(data);
    }
    catch(err){
      console.log(err);
    }
  })

//Maximum and minimum check 
  router.get('/prices', async(req, res) => {
    try {
        let max = req.query.max || 10000000;
        let min = req.query.min || 0
        let data = await CarModel.find({ $and: [{ price: { $lte: max } }, { price: { $gte: min } }] });
        res.json(data)
        if(min<max){
            res.json(data)
        }else{
            res.json({msg:"plese enter price bigger and try again"})
        }
    } catch (err) {
        console.log(err);
    }

})



// Editing an existing record
router.put("/:editId", auth, async(req,res) => {
    // Checks whether the information sent by a customer is correct
    let validBody = validateCar(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let editId = req.params.editId;
      let data = await CarModel.updateOne({_id:editId, user_id:req.tokenData._id}, req.body);
      
      // modfiedCount:1 
      res.json(data)
    }
    catch(err){
      console.log(err);
    }
  })

module.exports = router;