const IronQuality = require("../models/IronQuality");
const {removeUndefined} = require("../util/util");

exports.createQuality = async(req ,res)=>{
    try{

        const {Name  , CuttingPrice} = req.body;

        console.log("name ",Name , cuttingPrice);

        if(!Name){
            return res.status(400).json({
                status: false,
                message:"Please send the require name"
            })
        }

        const typeDetails = await IronQuality.create({Name: Name , CuttingPrice: CuttingPriceuttingPrice});
        console.log("typeDetail ",typeDetails);

        return res.status(200).json({
            status:true ,
            message:"Successfuly created the quality" , 
            typeDetails
        })

    } catch(error){
        console.log(error);
    }
}

exports.updateQuality = async ({id,Name,CuttingPrice}) => {
    try {
        let updateObj = removeUndefined({ Name,CuttingPrice });

        const updateQuality = await IronQuality.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

        return { status: true, message: 'IronQuality updated successfully', data: updateQuality };
    }
    catch (error) {
        console.log(error);
        return {
            status: false,
            message: "500"
        }
    }
}


exports.getAllQuality = async(req ,res)=>{
try{

   const allIronQuality = await IronQuality.find({});

   return res.status(200).json({
    status:true ,
    allIronQuality
   })

} catch(error){
    console.log(error);
    return res.status(500).json({
        status:false ,
        message:"Intenal server error "
    })
}

}

exports.deleteIronQuality = async(req ,res)=>{
    try{

        const {ironId} = req.params;

        if(!ironId){
            return res.status(403).json({
                status:false ,
            message:"Please send the type id"
            })
        }

        const typeDetail = await IronQuality.findByIdAndDelete({_id:ironId} , {new:true});

        return res.status(200).json({
            status:true ,
            message:"Successfuly deleted"
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            status:false ,
            message:"Intenal server error "
        })
    }
}