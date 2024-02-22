const express = require("express");
const auth = require("../middleware/auth");
const {createType , editType , deleteType , getAllType} = require("../controllers/TypeController");

const router = express.Router();

router.post('/createOrder',auth , createType );
router.get("/getAllType" ,auth , getAllType);
router.put("/editType" ,auth ,editType);
router.delete("/deleteType" ,auth, deleteType);


module.exports = router;