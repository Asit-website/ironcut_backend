const Order = require("../models/Order");

exports.createOrder = async(req ,res)=>{
    try{

        const { client , type , Date,  ironQuality, quantity, Length,Height, Width,  Weight,   CuttingPrice} = req.body;

         const orderDetail = await Order.create({client , type , Date , ironQuality , Length , Height , Width ,Weight , CuttingPrice, quantity});

          return res.status(200).json({
            status: true ,
            message:"Successfuly createad" , 
            orderDetail
          })


    } catch(error){
        console.log(error);
        return res.status(500).json({
            status: false ,
            message:"Internal server error "
        })
    }
}

