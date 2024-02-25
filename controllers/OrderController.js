const Order = require("../models/Order");
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

        const { type, Diameter, Length, quantity, Height, Weight } = req.body;

        let CuttingPrice;

        if (type === "Round") {
            CuttingPrice = (Diameter * Diameter * Length * quantity) / 785;
        }
        else {
            CuttingPrice = Height * Weight * quantity;
            console.log("cut", CuttingPrice);
        }


        return res.status(200).json({
            status: true,
            message: "Successfuly get",
            CuttingPrice
        })

    } catch (error) {
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
    else {
        data = await Order.find({ $and: and });
    }

    return { status: true, data };
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
