const express = require("express");
const auth = require("../middleware/auth");
const {createOrder , getCuttingPrice, getOrders} = require("../controllers/OrderController");

const router = express.Router();

router.post('/createOrder',auth , createOrder );
router.post("/getCuttingPrice" , auth , getCuttingPrice);

router.get('/getOrders', async (req, res) => {
    const data = await getOrders({ ...req.query });
    res.json(data);
});


module.exports = router;