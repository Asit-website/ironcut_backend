const express = require("express");
const auth = require("../middleware/auth");
const {createType , editType , deleteType , getAllType} = require("../controllers/TypeController");

const router = express.Router();

router.post('/createType',auth , createType );
router.get("/getAllType" ,auth , getAllType);
router.put("/editType" ,auth ,editType);
router.delete("/deleteType/:typeId" ,auth, deleteType);


module.exports = router;