const Order = require("../models/Order");

exports.createOrder = async(req ,res)=>{
    try{

        const {  clientName,
            type,
            ironQuality,
            diameter,
            quantity,
            length,
            height,
            width,
          weight,
          cuttingPrice
        } = req.body;

         const orderDetail = await Order.create({client: clientName, type  , ironQuality , Length:length , Height :height, Width:width ,Weight:weight , CuttingPrice:cuttingPrice, quantity ,Diameter:diameter });

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

exports.getCuttingPrice = async(req ,res)=>{
    try{

        const {Type ,diameter , length , quantity , height , weight} = req.body;

        let cuttingPrice;

         if(Type === "Round"){
              cuttingPrice = (diameter*diameter*length*quantity)/785;
         }
         else {
            cuttingPrice = height * weight * quantity;  
            console.log("cut" ,cuttingPrice);
         } 


          return res.status(200).json({
            status:true ,
            message:"Successfuly get" , 
         cuttingPrice
          })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            status:false ,
            message:"Internal server error"
        })
    }
}

exports.getOrders = async ({ id, query, page, perPage }) => {
    let and = [];

    if (id && id !== "" && id !== "undefined") {
        and.push({ _id: id });
    }

    if (query && query !== "" && query !== "undefined") {
        console.log(query);
        and.push({ title: { $regex: query, $options: "i" } });
    }

    if (and.length === 0) {
        and.push({});
    }
    // const count = await Project.count({ $and: and });
    let data;

    if (page && page !== "" && page !== "undefined") {
        data = await Order.find({ $and: and }).skip((page - 1) * perPage).limit(perPage);
    }
    else
    {
        data = await Order.find({ $and: and });
    }
    
    return { status: true, data };
};


