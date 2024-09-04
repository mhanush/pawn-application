
const { required } = require('joi');
const mongoose = require('mongoose');

const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    email: {
        type: String,
        required: true, 
    },
    id: {
        type: Number,
        unique: true
    },
    mobileNo: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    gram: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    rateofintrest: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now 
    },
    releaseDate: {
        type: Date,
        default: null 
    },
    amountpaidstatus: {
        type: Boolean,
        default: false
    },
    amountpaid: {
        type: Number,
        default: 0
    }
});
CustomerSchema.plugin(autoIncrement, {
    inc_field: 'id',
    start_seq: 1
});
CustomerSchema.index({ email: 1, id: 1 }, { unique: true });
const CustomerModel = mongoose.model('Customers',CustomerSchema);
module.exports = CustomerModel;