const Order = require("../models/Order");
const IronQuality = require("../models/IronQuality");
// const { removeUndefined } = require("../util/util");
const User = require("../models/User");
const Form = require("../models/FormItem");

exports.createOrder = async (req, res) => {
  try {
    const { formdata } = req.body;

    //  new form create krna hai
    const {
      client,
      type,
      ironQuality,
      Width,
      Diameter,
      quantity,
      Length,
      Height,
      Weight,
      CuttingPrice,
    } = formdata;
    
    const orderDetails = await Form.create({client , type , ironQuality  ,    Width,
        Diameter,
        quantity,
        Length,
        Height,
        Weight,
        CuttingPrice ,});
        const orderDetailsId = orderDetails._id;

        const orderCreate = await Order.create({client , quantity , Weight , CuttingPrice ,form:[orderDetailsId] });


    return res.status(200).json({
      status: true,
      message: "Successfully Created ",
      orderDetails
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error ",
    });
  }
};

exports.createOrder2 = async(req ,res)=>{
 const {id} = req.params;

  const {formdata} = req.body;

  const {
    client,
    type,
    ironQuality,
    Width,
    Diameter,
    quantity,
    Length,
    Height,
    Weight,
    CuttingPrice,
  } = formdata;
  
  const orderDetails = await Form.create({client , type , ironQuality  , Width,
      Diameter,
      quantity,
      Length,
      Height,
      Weight,
      CuttingPrice});

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { $push: { form: orderDetails._id } },
        { new: true }
      ).populate("form");
      

      const allFormDetails = updatedOrder.form;
      
         let totalQuantity = 0;
    let totalWeight = 0;
    let totalCuttingPrice = 0;

      for (const formDataItem of allFormDetails) {
      totalQuantity += parseFloat(formDataItem.quantity);
      totalWeight += Number(formDataItem.Weight);
      totalCuttingPrice += parseFloat(formDataItem.CuttingPrice);
    }


        const updatingForm =await Order.findByIdAndUpdate((id) ,{
            $set:{
            quantity: totalQuantity , 
            Weight: totalWeight , 
            CuttingPrice: totalCuttingPrice
            }
        }  , {new:true})

        return res.status(200).json({
            status: true,
            message: "Successfully Created ",
          });

}

exports.updateOrders = async (req, res) => {
  try {
    const { formdata } = req.body;
    const { orderId } = req.params;

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
          CuttingPrice: totalCuttingPrice,
          client: formdata[0].client,
        },
      },
      { new: true }
    );

    for (const formDataItem of formdata) {
      const { _id, ...formData } = formDataItem;

      if (_id) {
        await Form.findByIdAndUpdate(_id, { $set: formData }, { new: true });
      } else {
        const newForm = new Form(formData);
        await newForm.save();
        updatedOrder.form.push(newForm._id);
      }
    }

    await updatedOrder.save();
    return res
      .status(200)
      .json({
        status: true,
        message: "Order updated successfully",
        data: updatedOrder,
      });
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "500",
    };
  }
};

exports.getCuttingPrice = async (req, res) => {
  try {
    const { type, Diameter, Length, quantity, Height, Width, ironQuality } =
      req.body;

    const ironDetails = await IronQuality.findOne({ Name: ironQuality });

    if (ironDetails) {
      var { CuttingPrice } = ironDetails;
    }

    let cutPrice;
    let Height1 = Height / 25;
    let Width1 = Width / 25;

    if (type === "Round") {
      cutPrice = (Diameter * Diameter * quantity) / 785;
    } else {
      cutPrice = Height1 * Width1 * quantity;
    }

    if (CuttingPrice && CuttingPrice !== "") {
      cutPrice = cutPrice * CuttingPrice;
    }

    cutPrice = Math.ceil(cutPrice);

    return res.status(200).json({
      status: true,
      message: "Successfuly get",
      CuttingPrice: cutPrice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.getWeight = async (req, res) => {
  try {
    const { type, Length, Height, Width, Diameter } = req.body;
    let Weight;

    if (type === "Round") {
      Weight = Number(((Diameter * Diameter * Length) / 162000).toFixed(2));
    } else {
      Weight = Number(((Length * Height * Width) / 127551).toFixed(2));
      console.log(Weight);
    }

    return res.status(200).json({
      status: true,
      message: "Successfuly get",
      Weight,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

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
    data = await Order.find({ $and: and })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("form");
  } else {
    data = await Order.find({ $and: and }).populate("form");
  }

  return { status: true, data, count };
};

exports.deleteOrdeers = async ({ id}) => {
  const ans = await Order.findByIdAndDelete(id);

  await User.findOneAndUpdate(
    // { _id: userId },
    // { $inc: { completeOrder: 1 } },
    { new: true }
  );

  return { status: true, data: ans };
};

exports.getOrderPrimaryData = async ({}) => {
  try {
    const totalOrder = await Order.find({});

    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(
      currentDate.getTime() - 24 * 60 * 60 * 1000
    );

    const todayOrder = await Order.countDocuments({
      Date: { $gte: twentyFourHoursAgo, $lte: currentDate },
    });

    // const userDetail = await User.findOne({ _id: userId });
    const userDetail = await User.findOne();

    const completeOrder = userDetail.completeOrder;

    return {
      status: true,
      message: "Successfuly fetch",
      totalOrder: totalOrder.length,
      todayOrder,
      completeOrder,
    };
  } catch (error) {
    return {
      status: false,
      message: "Internal server error ",
    };
  }
};


exports.deleteForm = async( req ,res)=>{

   const {id , orderId} = req.params;

   const formDetails = await Form.findByIdAndDelete(id);
    

   const orderDetails = await Order.updateMany(
    { form: { $in: [id] } }, 
    { $pull: { form: id } }, 
    { multi: true } 
  );

 const updatedOrder = await Order.findById(orderId).populate("form");

  const allFormDetails = updatedOrder.form;
      
  let totalQuantity = 0;
let totalWeight = 0;
let totalCuttingPrice = 0;

for (const formDataItem of allFormDetails) {
totalQuantity += parseFloat(formDataItem.quantity);
totalWeight += Number(formDataItem.Weight);
totalCuttingPrice += parseFloat(formDataItem.CuttingPrice);
}


 const updatingForm =await Order.findByIdAndUpdate((orderId) ,{
     $set:{
     quantity: totalQuantity , 
     Weight: totalWeight , 
     CuttingPrice: totalCuttingPrice
     }
 }  , {new:true})


     return res.status(200).json({
      status:true , 
      message:"Successfult deleted "
     })
}


exports.fechUserForm = async(req ,res)=>{
  try{

    const {id} = req.params;

     const userForm = await Order.findById(id).populate("form");

      return res.status(200).json({
        status:true ,
        message:"Successfuly  fetch" , 
      data: userForm?.form
      })
      
      

  } catch(error){
    console.log(error);
  }
}

exports.updateFormHandler = async(req , res)=>{

  const { formdata } = req.body;
 const {id , orderId} = req.params;

  //  new form create krna hai
  const {
    type,
    ironQuality,
    Width,
    Diameter,
    quantity,
    Length,
    Height,
    Weight,
    CuttingPrice,
  } = formdata;


  const updateObj = {
    type,
    ironQuality,
    Width,
    Diameter,
    quantity,
    Length,
    Height,
    Weight,
    CuttingPrice,
  };

  const updatedForm = await Form.findByIdAndUpdate(id, updateObj, { new: true });

  const updatedOrder = await Order.findById(orderId).populate("form");

  const allFormDetails = updatedOrder.form;
      
  let totalQuantity = 0;
let totalWeight = 0;
let totalCuttingPrice = 0;

for (const formDataItem of allFormDetails) {
totalQuantity += parseFloat(formDataItem.quantity);
totalWeight += Number(formDataItem.Weight);
totalCuttingPrice += parseFloat(formDataItem.CuttingPrice);
}


 const updatingForm =await Order.findByIdAndUpdate((orderId) ,{
     $set:{
     quantity: totalQuantity , 
     Weight: totalWeight , 
     CuttingPrice: totalCuttingPrice
     }
 }  , {new:true})


   return res.status(200).json({
    status:true ,
    updatedForm
   })

}