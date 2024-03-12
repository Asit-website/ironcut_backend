const express = require("express");
require('dotenv').config();
require('./db/conn');
const app = express();
const cors = require("cors");
const port = 5000 ;

const userRouter = require("./routes/userRouter");
const typeRouter = require("./routes/TypeRouter");
const orderRouter = require("./routes/OrderRouter");
const qualityRouter = require("./routes/IronQualityRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user",userRouter);
app.use("/order" , orderRouter);
app.use("/type" ,typeRouter );
app.use("/quality",qualityRouter);
app.get("/",(req,res)=>{
    res.send("this");
})

app.listen(port, () => {
    console.log('Listening on ', port);
});
