const express = require("express");
const auth = require("../middleware/auth");
const {createOrder} = require("../controllers/OrderController");

const router = express.Router();

router.post('/createOrder',auth , createOrder );


module.exports = router;