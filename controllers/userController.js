const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const verify = async ({ auth }) => {
    if (!auth) {
        return { status: false };
    }
    return { status: true };
};


const getUsers = async ({ id, query, page, perPage }) => {
    // let and = [];
    // if (id && id !== "" && id !== "undefined") {
    //     and.push({ _id: id });
    // }
    // if (query && query !== "" && query !== "undefined") {
    //     console.log(query);
    //     and.push({ name: { $regex: query, $options: "i" } });
    // }
    // if (and.length === 0) {
    //     and.push({});
    // }

    // const count = await User.count({ $and: and });

    // let data;
    // if (page && page !== "" && page !== "undefined") {
    //     data = await User.find({ $and: and }).skip((page - 1) * perPage).limit(perPage);
    // }
    
        // data = await User.find({ $and: and });
         data = await User.find();
    
    // return { status: true, data, count };
    return { status: true, data };
};

// const signin = async ({ name, email, phone, password }) => {
const signin = async ({ name, email, password }) => {
    const checkUser = await User.findOne({ email });
    // const checkUser1 = await User.findOne({ phone });

    // if (checkUser || checkUser1) {
    if (checkUser) {
        return { status: false, message: 'User already exists' };
    }

    const pass = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        // phone,
        password: pass,
        role: 'ADMIN'
    });
    const saveUser = await newUser.save();
    return { status: true, data: saveUser, message: 'User Registration Successfull' };
};

const login = async ({ email, password }) => {
    let emailCheck = await User.findOne({ email });
    if (!emailCheck) {
        return { status: false, message: "Invalid Credentials" };
    }
    const passwordVerify = await bcrypt.compare(password, emailCheck.password);
    if (!passwordVerify) {
        return { status: false, message: "Invalid Credentials" };
    }
    let token = jwt.sign({ _id: emailCheck._id }, process.env.SK);
    return { status: true, message: "Login success", token, user: emailCheck };
};

// const updateUser = async ({ userId, name, email, phone,categoryies, website, budget,location, aboutCompany, file, auth,twiter,facebook,linkdin,insta }) => {
//     // if (!auth) {
//     //     return { success: false, message: "Not Authorised" };
//     // }

//     console.log("email" ,email);


//     // if (auth?.email !== email) {
//         let checkUser = User.findOne({ email:email });
//         console.log("checkuser" , checkUser);
//         // if (checkUser) {
//         //     return { status: false, data: ans, message: 'Email already taken' };
//         // }
//     // }
//     let updateObj = User({ name, email,phone,categoryies, website, budget,location, aboutCompany,twiter,facebook,linkdin,insta});

//     if (file && file !== "") {
//         var result = await uploadToCloudinary(file.path);
//         updateObj['img'] = {
//             url: result.url,
//             id: result.public_id
//         };
//     }

//     // if (password && password !== "undefined" && password !== "") {
//     //     password = await bcrypt.hash(password, 3);
//     //     updateObj['password'] = password;
//     // }
//     let ans = await User.findByIdAndUpdate(userId, { $set: updateObj }, { new: true });
//     return { status: true, data: ans, message: 'User Updated Successfull' };
// };

const updateUser = async ({ userId, name, email, phone, categoryies, website, budget, location, aboutCompany, file, auth, twiter, facebook, linkdin, insta, city }) => {
    try {

        console.log("file", file);
        // Check if the email is already taken by another user
        const checkUser = await User.findOne({ email: email });
        if (checkUser && checkUser._id != userId) {
            return { status: false, data: null, message: 'Email already taken' };
        }

        // Prepare the update object
        let updateObj = {
            name,
            email,
            phone,
            categoryies,
            website,
            budget,
            location,
            aboutCompany,
            twiter,
            facebook,
            linkdin,
            insta,
            city
        };

        // Upload file to Cloudinary and update img field if file is provided
        if (file && file !== "") {
            const result = await uploadToCloudinary(file.path);
            updateObj['img'] = {
                url: result.url,
                id: result.public_id
            };
        }

        // Update the user without modifying the _id field
        const ans = await User.findByIdAndUpdate(userId, { $set: updateObj }, { new: true, omitUndefined: true });

        return { status: true, data: ans, message: 'User Updated Successfully' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { status: false, data: null, message: 'Error updating user' };
    }
};


const deleteUser = async ({ id }) => {
    const ans = await User.findByIdAndDelete(id);
    return { status: true, data: ans };

};

const deleteUsers = async () => {
    const ans = await User.deleteMany();
    return { status: true, data: ans };
};

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

const sendOtp = async ({ email }) => {
    let emailCheck = await User.findOne({ email });
    if (!emailCheck) {
        return { status: false, message: "Invalid Email" };
    }

    let otp = generateOtp();
    // Create a SMTP transport object
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "webmaster.kushel@gmail.com",
            pass: "paurymswxlpytekp",
        },
        from: "info@kusheldigi.com",
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Message object
    var message = {
        from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
        to: `"User" <${email}>`,

        subject: 'Password reset OTP',

        text: `<div>
                    <p>OTP: ${otp}</p>
                </div>`,

        html: `<div>
                    <p>OTP: ${otp}</p>
                </div>`
    };

    transporter.sendMail(message, function (error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
    });

    return { status: true, message: "Otp Sent", email, otp };
};

const submitOtp = async ({ otp, otp1 }) => {
    console.log(otp, otp1);
    if (otp.toString() !== otp1.toString()) {

        return { status: false, message: "Invalid Otp" };
    }
    console.log(otp, otp1);
    return { status: true, message: "Success" };
};

const changePassword = async ({ email, password }) => {
    password = await bcrypt.hash(password, 8);
    await User.findOneAndUpdate({ email }, { password }, { new: true });

    return { status: true, message: "Password reset success" };
};

const resetPassword = async ({ password, userId }) => {
    let password1 = await bcrypt.hash(password, 8);
    let user = await User.findOneAndUpdate({ _id: userId }, { password: password1 }, { new: true });
    console.log(user);
    // Create a SMTP transport object
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "webmaster.kushel@gmail.com",
            pass: "paurymswxlpytekp",
        },
        from: "info@kusheldigi.com",
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Message object
    var message = {
        from: '"Kushel Digi Solutions" <info@kusheldigi.com>',
        to: `"User" <${user.email}>`,

        subject: 'Password Reset | New Password',

        text: `New Password: ${password}`,

        html: `<div>
                    <p>New Password: ${password}</p>
                </div>`
    };

    transporter.sendMail(message, function (error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
    });

    return { status: true, message: "Password reset success" };
};

module.exports={
    getUsers,
    signin,
    login,
    sendOtp,
    submitOtp,
    changePassword,
    resetPassword,
    verify
}