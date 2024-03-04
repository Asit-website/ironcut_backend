const express = require("express");
const auth = require("../middleware/auth");
const {createOrder , getCuttingPrice, getOrders,updateOrders,deleteOrdeers} = require("../controllers/OrderController");

const router = express.Router();

router.post('/createOrder',auth , createOrder );
router.post("/getCuttingPrice" , auth , getCuttingPrice);
router.post("/getWeight", auth, )

router.get('/getOrders', async (req, res) => {
    const data = await getOrders({ ...req.query });
    res.json(data);
});

router.put('/updateOrders/:id', auth, async (req, res) => {
    try {
        let data = await updateOrders({ ...req.body, auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteOrders/:id', async (req, res) => {
    try {
        let data = await deleteOrdeers({id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});


module.exports = router;