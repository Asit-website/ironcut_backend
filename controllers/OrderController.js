const Order = require("../models/Order");
const IronQuality = require("../models/IronQuality");
// const { removeUndefined } = require("../util/util");
const User = require("../models/User");
const Form = require("../models/FormItem")

exports.createOrder = async (req, res) => {
  try{
     const {formdata} = req.body;


// Calculate order values from formdata
  let totalQuantity = 0;
  let totalWeight = 0;
  let totalCuttingPrice = 0;

  for (const formDataItem of formdata) {
    totalQuantity += parseFloat(formDataItem.quantity);
    totalWeight += Number((formDataItem.Weight).toFixed(2));
    totalCuttingPrice += parseFloat(formDataItem.CuttingPrice);
  }

  
  const newOrder = new Order({
      client: formdata[0].client, // Assuming client is part of the request body
      quantity: totalQuantity,
      Weight: totalWeight,
      CuttingPrice: totalCuttingPrice,
      form: [] 
    });
    
    for (const formDataItem of formdata) {
        const newForm = new Form(formDataItem);
        await newForm.save();
        
        // Add the form item's id to the order's form array
        await newOrder.form.push(newForm._id);
    }
    
    // Save the order with the updated form array
    await newOrder.save();


   return res.status(200).json({
    status: true , 
    message:"Successfully Created "
   }) 
 }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error "
        })
    }
}

exports.updateOrders = async (req ,res ) => {
    try {

        const {formdata} = req.body;
        const {orderId} = req.params;


        let totalQuantity = 0;
        let totalWeight = 0;
        let totalCuttingPrice = 0;
      
        for (const formDataItem of formdata) {
          totalQuantity += parseFloat(formDataItem.quantity);
          totalWeight += parseFloat(formDataItem.Weight);
          totalCuttingPrice += parseFloat(formDataItem.CuttingPrice);
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
              $set: {
                quantity: totalQuantity,
                Weight: totalWeight,
                CuttingPrice: totalCuttingPrice , 
                client: formdata[0].client
              }
            },
            { new: true } 
          );

  for (const formDataItem of formdata) {
    const { _id, ...formData } = formDataItem; 

    if (_id) {
      await Form.findByIdAndUpdate(
        _id,
        { $set: formData },
        { new: true }
      );
    } else {
      const newForm = new Form(formData);
      await newForm.save();
      updatedOrder.form.push(newForm._id); 
    }
  }

  await updatedOrder.save();
        return res.status(200).json({ status: true, message: 'Order updated successfully', data: updatedOrder }); 
    }
    catch (error) {
        console.log(error);
        return {
            status: false,
            message: "500"
        }
    }
}

exports.getCuttingPrice = async (req, res) => {
    try {

        const { type, Diameter, Length, quantity, Height, Width, ironQuality } = req.body;

        const ironDetails = await IronQuality.findOne({ Name: ironQuality });

        if (ironDetails) {
            var { CuttingPrice } = ironDetails;

        }


        let cutPrice;
        let Height1 = Height / 25;
        let Width1 = Width / 25;


        if (type === "Round") {
            cutPrice = (Diameter * Diameter * quantity) / 785;
        }
        else {
            cutPrice = Height1 * Width1 * quantity;
        }

        if (CuttingPrice && CuttingPrice !== '') {

            cutPrice = cutPrice * CuttingPrice;
        }

        cutPrice = Math.ceil(cutPrice);


        return res.status(200).json({
            status: true,
            message: "Successfuly get",
            CuttingPrice: cutPrice
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        })
    }
}

exports.getWeight = async (req, res) => {
    try {
        const { type, Length, Height, Width, Diameter } = req.body;
        let Weight;

        if (type === "Round") {
            Weight = Number(((Diameter * Diameter * Length) / 162000).toFixed(2));
        }
        else {
            Weight = Number(((Length * Height * Width) / 127551).toFixed(2));
            console.log(Weight);
        }

        return res.status(200).json({
            status: true,
            message: "Successfuly get",
            Weight
        })
    }



    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        })
    }
}

exports.getOrders = async ({ id, query, page, perPage }) => {
    let and = [];

    if (id && id !== "" && id !== "undefined") {
        and.push({ _id: id });
    }

    if (query && query !== "" && query !== "undefined") {
        and.push({ client: { $regex: query, $options: "i" } });
    }

    if (and.length === 0) {
        and.push({});
    }
    const count = await Order.countDocuments({ $and: and });
    let data;

    if (page && page !== "" && page !== "undefined") {
        data = await Order.find({ $and: and }).skip((page - 1) * perPage).limit(perPage).populate("form");
    }
    else {
        data = await Order.find({ $and: and }).populate("form");
    }

    

    return { status: true, data, count };
};



exports.deleteOrdeers = async ({ id ,userId }) => {

    const ans = await Order.findByIdAndDelete(id);

    
    await User.findOneAndUpdate(
        { _id: userId }, 
        { $inc: { completeOrder: 1 } }, 
        { new: true }, 
    )
    
    return { status: true, data: ans };
};

exports.getOrderPrimaryData = async({userId})=>{
  try{

    const totalOrder = await Order.find({});

    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));

    const todayOrder = await Order.countDocuments({ Date: { $gte: twentyFourHoursAgo, $lte: currentDate } });
     
        const userDetail = await User.findOne({_id:userId});

        const completeOrder = userDetail.completeOrder;

         return {
           status:true ,
           message:"Successfuly fetch" ,
           totalOrder : totalOrder.length , 
           todayOrder , 
           completeOrder
         }

  } catch(error){
    return {
        status:false ,
        message:"Internal server error "
    }
  }
          
      
}
