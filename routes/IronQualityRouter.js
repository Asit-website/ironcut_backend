const express = require("express");
const auth = require("../middleware/auth");
const {createQuality , updateQuality , deleteIronQuality , getAllQuality} = require("../controllers/IronQualityController");

const router = express.Router();

router.post('/createQuality',auth , createQuality );
router.get("/getAllQuality" ,auth , getAllQuality);
// router.put("/editType" ,auth ,editType);
router.delete("/deleteQuality/:ironId" ,auth, deleteIronQuality);

router.put('/updateQuality/:id', async (req, res) => {
    try {
        let data = await updateQuality({ ...req.body, id: req.params.id });
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