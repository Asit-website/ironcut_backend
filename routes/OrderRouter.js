const express = require("express");
const auth = require("../middleware/auth");
const {createOrder , getCuttingPrice} = require("../controllers/OrderController");

const router = express.Router();

router.post('/createOrder',auth , createOrder );
router.post("/getCuttingPrice" , auth , getCuttingPrice);


module.exports = router;