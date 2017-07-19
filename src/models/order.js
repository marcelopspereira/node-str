'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    number: {
        type: String,
        required: true,
        trim: true
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        require: true,
        enum: ['create,done'],
        default: 'create'
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    items: [{
        quantiy: {
            type: Number,
            require: true,
            default: 1
        },
        price: {
            type: Number,
            require: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
    }]
});

module.exports = mongoose.model('Order', schema);