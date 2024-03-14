const Order = require("../models/Order");
const IronQuality = require("../models/IronQuality");
const { removeUndefined } = require("../util/util");

exports.createOrder = async (req, res) => {
    try {

        const { client,
            type,
            ironQuality,
            Diameter,
            quantity,
            Length,
            Height,
            Width,
            Weight,
            CuttingPrice
        } = req.body;

        const orderDetail = await Order.create({
            client,
            type,
            ironQuality,
            Diameter,
            quantity,
            Length,
            Height,
            Width,
            Weight,
            CuttingPrice
        });

        return res.status(200).json({
            status: true,
            message: "Successfuly createad",
            orderDetail
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error "
        })
    }
}

exports.getCuttingPrice = async (req, res) => {
    try {

        const { type, Diameter, Length, quantity, Height, Width, ironQuality } = req.body;

        console.log("name", ironQuality);

        const ironDetails = await IronQuality.findOne({ Name: ironQuality });

        if (ironDetails) {
            var { CuttingPrice } = ironDetails;

        }
        console.log("iron", ironDetails);

        console.log("cuting", CuttingPrice);

        let cutPrice;
        let Height1 = Height / 25;
        let Width1 = Width / 25;


        if (type === "Round") {
            cutPrice = (Diameter * Diameter * quantity) / 785;
        }
        else {
            cutPrice = Height1 * Width1 * quantity;
            console.log("cut", cutPrice);
        }

        if (CuttingPrice && CuttingPrice !== '') {

            cutPrice = cutPrice * CuttingPrice;
        }

        console.log("cc", cutPrice);

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
            console.log("wd", Weight);
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
        console.log(query);
        and.push({ client: { $regex: query, $options: "i" } });
    }

    if (and.length === 0) {
        and.push({});
    }
    const count = await Order.countDocuments({ $and: and });
    let data;

    if (page && page !== "" && page !== "undefined") {
        data = await Order.find({ $and: and }).skip((page - 1) * perPage).limit(perPage);
    }
    else {
        data = await Order.find({ $and: and });
    }

    return { status: true, data, count };
};

exports.updateOrders = async ({
    id,
    client,
    type,
    ironQuality,
    Diameter,
    quantity,
    Length,
    Height,
    Width,
    Weight,
    CuttingPrice
}) => {
    try {
        let updateObj = removeUndefined({
            client,
            type,
            ironQuality,
            Diameter,
            quantity,
            Length,
            Height,
            Width,
            Weight,
            CuttingPrice
        });

        const updateOrder = await Order.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

        return { status: true, message: 'Order updated successfully', data: updateOrder };
    }
    catch (error) {
        console.log(error);
        return {
            status: false,
            message: "500"
        }
    }
}

exports.deleteOrdeers = async ({ id }) => {
    const ans = await Order.findByIdAndDelete(id);
    return { status: true, data: ans };
};
