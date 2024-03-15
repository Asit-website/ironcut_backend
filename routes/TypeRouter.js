const express = require("express");
const auth = require("../middleware/auth");
const { createType, updateType, deleteType, getAllType } = require("../controllers/TypeController");

const router = express.Router();

router.post('/createType', auth, createType);
router.get("/getAllType", auth, getAllType);
// router.put("/editType" ,auth ,editType);
router.delete("/deleteType/:typeId", auth, deleteType);

router.put('/updateType/:id', async (req, res) => {
    try {
        let data = await updateType({ ...req.body, id: req.params.id });
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