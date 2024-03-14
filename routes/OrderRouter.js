const express = require("express");
const auth = require("../middleware/auth");
const {createOrder , getCuttingPrice, getOrderPrimaryData, getOrders,updateOrders,deleteOrdeers,getWeight} = require("../controllers/OrderController");

const router = express.Router();

router.post('/createOrder',auth , createOrder );
router.post("/getCuttingPrice" , auth , getCuttingPrice);
router.post("/getWeight", auth, getWeight );

router.get('/getOrders', async (req, res) => {
    const data = await getOrders({ ...req.query });
    res.json(data);
});

router.post('/updateOrders/:orderId' , updateOrders);

router.delete('/deleteOrders/:id/:userId' ,  async (req, res) => {

     
    try {
        let data = await deleteOrdeers({id: req.params.id , userId: req.params.userId });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.get("/getOrderPrimaryDetail/:userId" ,  async(req ,res)=>{
    try{
        let data = await getOrderPrimaryData({userId: req.params.userId});

         if(!data.status){
            return res.status(400).json(data);
         }

          res.json(data);

    } catch(error){
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
})


module.exports = router;