const Type = require("../models/Type")
const {removeUndefined} = require("../util/util");
exports.createType = async(req ,res)=>{
    try{

        const {Name} = req.body;

        if(!Name){
            return res.status(400).json({
                status: false,
                message:"Please send the require name"
            })
        }

        const typeDetails = await Type.create({Name: Name});

        return res.status(200).json({
            status:true ,
            message:"Successfuly created the type" , 
            typeDetails
        })

    } catch(error){
        console.log(error);
    }
}

exports.updateType = async ({id,Name}) => {
    try {
        let updateObj = removeUndefined({ Name });

        const updateType = await Type.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

        return { status: true, message: 'Subscription updated successfully', data: updateType };
    }
    catch (error) {
        console.log(error);
        return {
            status: false,
            message: "500"
        }
    }
}


exports.getAllType = async(req ,res)=>{
try{

   const allType = await Type.find({});

   return res.status(200).json({
    status:true ,
    allType
   })

} catch(error){
    console.log(error);
    return res.status(500).json({
        status:false ,
        message:"Intenal server error "
    })
}

}

exports.deleteType = async(req ,res)=>{
    try{

        const {typeId} = req.params;

        if(!typeId){
            return res.status(403).json({
                status:false ,
            message:"Please send the type id"
            })
        }

        const typeDetail = await Type.findByIdAndDelete({_id:typeId} , {new:true});

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