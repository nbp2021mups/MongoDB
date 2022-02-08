const express = require("express");
const router = express.Router();


const { OrderModel } = require("../models/ordersModel");

//potvrdivanje narudzbine
router.patch("/accept/:idOrder", async (req, res)=>{
  try{
    await OrderModel.findByIdAndUpdate(req.params.idOrder, {$set: {potvrdjena : true}});
    return res.send("Porudžbina je prihvaćena uspešno.")
  }
  catch (ex){
    console.log(ex);
    return res.status(501).send("Došlo je do greške prilikom prihvatanja porudžbine, pokušajte ponovo.");
  }
})

//odbijanje narudzbine
router.patch("/decline/:idOrder", async (req, res)=>{
  try{

  }
  catch (ex){
    console.log(ex);
    return res.status(501).send("Došlo je do greške prilikom odbijanja porudžbine, pokušajte ponovo.");
  }
})

module.exports = router;
