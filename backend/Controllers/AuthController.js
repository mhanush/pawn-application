const UserModel = require("../Models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomerModel = require("../Models/Customer");
const signup = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409)
                .json({message:"User already exist",success:false});
        }
        const userModel = new UserModel({name,email,password});
        userModel.password = await bcrypt.hash(password,10);
        await userModel.save();
        res.status(201)
        .json({
            message:"signup successfull",
            success : true
        })
    }catch(err){
        res.status(500)
            .json({
                message:"Internal Server Error",
                success:false
            })
    }
}
const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required", success: false });
        }
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(403)
                .json({message:"Auth Failed Email or Password is Wrong",success:false});
        }
        const isPassEqual = await bcrypt.compare(password,user.password);
        if(!isPassEqual){
            return res.status(403)
                .json({message:"Auth Failed Email or Password is Wrong",success:false});
        }
        const jwtToken=jwt.sign(
            {email:user.email,_id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        )
        res.status(200)
        .json({
            message:"login successfull",
            success : true,
            jwtToken:jwtToken,
            email,
            name:user.name
        })
    }catch(err){
        res.status(500)
            .json({
                message:"Internal Server Error",
                success:false
            })
    }
}
const today = async (req, res) => {
    try {
        const email = req.user.email;
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        const customers = await CustomerModel.find({
            email,
            $or: [
                { releaseDate: { $gte: startOfDay, $lte: endOfDay } },
                { date: { $gte: startOfDay, $lte: endOfDay } }
            ]
        });
        let totalAmount=0;
        let totalAmountPaid=0;
        let totalCustomers=0;
        let totalInterest=0;
        if (customers.length === 0) {
            return res.status(404).json({
                totalCustomers,
                totalAmount,
                totalAmountPaid,
                totalInterest,
                message: "No customer data found for today",
                success: false
            });
        }

        totalCustomers = customers.length;
        totalAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
        totalAmountPaid = customers.reduce((sum, customer) => sum + customer.amountpaid, 0);
        totalInterest = customers.reduce((sum, customer) => {
            if (customer.status === true && customer.amountpaidstatus === true) {
                return sum + (customer.amountpaid - customer.amount);
            }
            return sum;
        }, 0);
        res.status(200).json({
            data: customers,
            totalCustomers,
            totalAmount,
            totalAmountPaid,
            totalInterest,
            message: "Customer data retrieved successfully",
            success: true
        });
    } catch (err) {
        console.error("Error retrieving customer data:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
const thisWeek = async (req, res) => {
    try {
        const email = req.user.email;
        const today = new Date();
        const dayOfWeek = today.getDay() || 7;
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek + 1);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const customers = await CustomerModel.find({
            email,
            $or: [
                { releaseDate: { $gte: startOfWeek, $lte: endOfWeek } },
                { date: { $gte: startOfWeek, $lte: endOfWeek } }
            ]
        });

        if (customers.length === 0) {
            return res.status(404).json({
                message: "No customer data found for this week",
                success: false
            });
        }
        const totalCustomers = customers.length;
        const totalAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
        const totalAmountPaid = customers.reduce((sum, customer) => sum + customer.amountpaid, 0);
        const totalInterest = customers.reduce((sum, customer) => {
            if (customer.status === true && customer.amountpaidstatus === true) {
                return sum + (customer.amountpaid - customer.amount);
            }
            return sum;
        }, 0);
        res.status(200).json({
            data: customers,
            totalCustomers,
            totalAmount,
            totalAmountPaid,
            totalInterest,
            message: "Customer data retrieved successfully",
            success: true
        });
    } catch (err) {
        console.error("Error retrieving customer data:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
const thisMonth = async (req, res) => {
    try {
        const email = req.user.email;
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const customers = await CustomerModel.find({
            email,
            $or: [
                { releaseDate: { $gte: startOfMonth, $lte: endOfMonth } },
                { date: { $gte: startOfMonth, $lte: endOfMonth } }
            ]
        });

        if (customers.length === 0) {
            return res.status(404).json({
                message: "No customer data found for this month",
                success: false
            });
        }
        const totalCustomers = customers.length;
        const totalAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
        const totalAmountPaid = customers.reduce((sum, customer) => sum + customer.amountpaid, 0);
        const totalInterest = customers.reduce((sum, customer) => {
            if (customer.status === true && customer.amountpaidstatus === true) {
                return sum + (customer.amountpaid - customer.amount);
            }
            return sum;
        }, 0);
        res.status(200).json({
            data: customers,
            totalCustomers,
            totalAmount,
            totalAmountPaid,
            totalInterest,
            message: "Customer data retrieved successfully",
            success: true
        });
    } catch (err) {
        console.error("Error retrieving customer data:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
const thisQuarter = async (req, res) => {
    try {
        const email = req.user.email;
        const today = new Date();
        const quarter = Math.floor((today.getMonth() + 3) / 3);
        const startOfQuarter = new Date(today.getFullYear(), (quarter - 1) * 3, 1);
        const endOfQuarter = new Date(today.getFullYear(), quarter * 3, 0);
        endOfQuarter.setHours(23, 59, 59, 999);

        const customers = await CustomerModel.find({
            email,
            $or: [
                { releaseDate: { $gte: startOfQuarter, $lte: endOfQuarter } },
                { date: { $gte: startOfQuarter, $lte: endOfQuarter } }
            ]
        });

        if (customers.length === 0) {
            return res.status(404).json({
                message: "No customer data found for this quarter",
                success: false
            });
        }
        const totalCustomers = customers.length;
        const totalAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
        const totalAmountPaid = customers.reduce((sum, customer) => sum + customer.amountpaid, 0);
        const totalInterest = customers.reduce((sum, customer) => {
            if (customer.status === true && customer.amountpaidstatus === true) {
                return sum + (customer.amountpaid - customer.amount);
            }
            return sum;
        }, 0);
        res.status(200).json({
            data: customers,
            totalCustomers,
            totalAmount,
            totalAmountPaid,
            totalInterest,
            message: "Customer data retrieved successfully",
            success: true
        });
    } catch (err) {
        console.error("Error retrieving customer data:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
const thisHalfYear = async (req, res) => {
    try {
        const email = req.user.email;
        const today = new Date();
        const halfYear = today.getMonth() < 6 ? 0 : 6;
        const startOfHalfYear = new Date(today.getFullYear(), halfYear, 1);
        const endOfHalfYear = new Date(today.getFullYear(), halfYear + 6, 0);
        endOfHalfYear.setHours(23, 59, 59, 999);

        const customers = await CustomerModel.find({
            email,
            $or: [
                { releaseDate: { $gte: startOfHalfYear, $lte: endOfHalfYear } },
                { date: { $gte: startOfHalfYear, $lte: endOfHalfYear } }
            ]
        });

        if (customers.length === 0) {
            return res.status(404).json({
                message: "No customer data found for this half-year",
                success: false
            });
        }
        const totalCustomers = customers.length;
        const totalAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
        const totalAmountPaid = customers.reduce((sum, customer) => sum + customer.amountpaid, 0);
        const totalInterest = customers.reduce((sum, customer) => {
            if (customer.status === true && customer.amountpaidstatus === true) {
                return sum + (customer.amountpaid - customer.amount);
            }
            return sum;
        }, 0);
        res.status(200).json({
            data: customers,
            totalCustomers,
            totalAmount,
            totalAmountPaid,
            totalInterest,
            message: "Customer data retrieved successfully",
            success: true
        });
    } catch (err) {
        console.error("Error retrieving customer data:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
const thisYear = async (req, res) => {
    try {
        const email = req.user.email;
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31);
        endOfYear.setHours(23, 59, 59, 999);

        const customers = await CustomerModel.find({
            email,
            $or: [
                { releaseDate: { $gte: startOfYear, $lte: endOfYear } },
                { date: { $gte: startOfYear, $lte: endOfYear } }
            ]
        });

        if (customers.length === 0) {
            return res.status(404).json({
                message: "No customer data found for this year",
                success: false
            });
        }
        const totalCustomers = customers.length;
        const totalAmount = customers.reduce((sum, customer) => sum + customer.amount, 0);
        const totalAmountPaid = customers.reduce((sum, customer) => sum + customer.amountpaid, 0);
        const totalInterest = customers.reduce((sum, customer) => {
            if (customer.status === true && customer.amountpaidstatus === true) {
                return sum + (customer.amountpaid - customer.amount);
            }
            return sum;
        }, 0);
        res.status(200).json({
            data: customers,
            totalCustomers,
            totalAmount,
            totalAmountPaid,
            totalInterest,
            message: "Customer data retrieved successfully",
            success: true
        });
    } catch (err) {
        console.error("Error retrieving customer data:", err);
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

const add = async(req,res)=>{
    try{
        const email = req.user.email;
        const date = Date.now();
        console.log(date);
        console.log(email);
        const {mobileNo, name, address, city, type, model, gram, amount,rateofintrest} = req.body;
        const existingCustomer = await CustomerModel.findOne({email,date});
        if(existingCustomer){
            return res.status(409)
                .json({message:"Customer already exist",success:false});
        }
        const newCustomer = new CustomerModel({email, mobileNo, name, address, city, type, model, gram, amount,rateofintrest});
        await newCustomer.save();
        res.status(201)
        .json({
            message:"Customer data added successfull",
            success : true
        })
    }catch(err){
        console.error("Error adding customer:", err);
        res.status(500)
            .json({
                data:newCustomer,
                message:"Internal Server Error",
                success:false
            })
    }
}
const release = async(req,res)=>{
    try{
        const {id} = req.body;
        const email = req.user.email;
        const date = new Date();
        const customer = await CustomerModel.findOne({email,id});
        if(!customer){
            return res.status(404)
                .json({message:"No such item found",success:false});
        }
        if(customer.status && customer.amountpaidstatus){
            return res.status(400)
                .json({message:"Item already released",success:false})
        }
        customer.status=true;
        customer.amountpaidstatus=true;
        customer.releaseDate=date;
        await customer.save();
        res.status(200)
        .json({
            data:customer,
            message:"Customer item released successfull",
            success : true
        })
    }catch(err){
        res.status(500)
            .json({
                message:"Internal Server Error",
                success:false
            })
    }
}
const edit = async(req,res)=>{
    try{
        const {id,mobileNo, name, address, city, type, model, gram, amount, rateofintrest, status, releaseDate, amountpaidstatus} = req.body;
        const email = req.user.email;
        let releaseDateFormatted;
        if (releaseDate) {
            releaseDateFormatted = new Date(releaseDate);
            if (isNaN(releaseDateFormatted.getTime())) {
                return res.status(400).json({ message: "Invalid release date format", success: false });
            }
        }
        const customer = await CustomerModel.findOne({id,email});
        if(!customer){
            return res.status(404)
                .json({message:"Customer not found",success:false});
        }
        if (name && name.trim()) customer.name = name.trim();
        if (mobileNo && mobileNo.trim()) customer.mobileNo = mobileNo.trim();
        if (address && address.trim()) customer.address = address.trim();
        if (city && city.trim()) customer.city = city.trim();
        if (type && type.trim()) customer.type = type.trim();
        if (model && model.trim()) customer.model = model.trim();
        if (gram && !isNaN(Number(gram))) customer.gram = Number(gram);
        if (amount && !isNaN(Number(amount))) customer.amount = Number(amount);
        if (rateofintrest && !isNaN(Number(rateofintrest))) customer.rateofintrest = Number(rateofintrest);
        if (status !== undefined) customer.status = Boolean(status);
        if (releaseDateFormatted) customer.releaseDate = releaseDateFormatted;
        if (amountpaidstatus !== undefined) customer.amountpaidstatus = Boolean(amountpaidstatus);

        await customer.save();
        res.status(200)
        .json({
            data:customer,
            message:"Customer details updated successfully",
            success : true,
        })
    }catch(err){
        console.error("Error updating customer:", err);
        res.status(500)
            .json({
                message:"Internal Server Error",
                success:false
            })
    }
}
const view = async(req,res)=>{
    try{
        const {id,mobileNo} = req.body;
        const email = req.user.email;
        let numericId;
        if(id){
            numericId = Number(id);
            if (isNaN(numericId)) {
                return res.status(400)
                    .json({ message: "Invalid ID format", success: false });
            }
            console.log(email,id);
        }
        let user;
        if(id && mobileNo){
            user = await CustomerModel.findOne({ email: email, id: numericId,mobileNo:mobileNo});}
        else if(id){
            user = await CustomerModel.findOne({ email: email, id: numericId });}
        else if(mobileNo){
            user = await CustomerModel.find({ email: email, mobileNo: mobileNo });}
        if(!user){
            return res.status(403)
                .json({message:"No such data Found",success:false});
        }
        if (!user || (Array.isArray(user) && user.length === 0)) {
            return res.status(403).json({ message: "No such data found", success: false });
        }
        res.status(200)
        .json({
            data:Array.isArray(user) ? user : [user],
            message:"Customer item is viewed successfull",
            success : true
        })
    }catch(err){
        res.status(500)
            .json({
                message:"Internal Server Error",
                success:false
            })
    }
}
module.exports = {
    signup,
    login,
    today,
    add,
    view,
    edit,
    release,
    thisWeek,
    thisMonth,
    thisQuarter,
    thisHalfYear,
    thisYear
}