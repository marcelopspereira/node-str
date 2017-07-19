'use strict'

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async () => {
    const res = await Customer
        .find();
    return res;
}

exports.getById = async (id) => {
    const res = await Customer
        .findOne({
            id: id
        });
    return res;
}

exports.create = async (data) => {
    var customer = new Customer(data);
    await customer.save()
}

exports.update = async (id, data) => {
    await Customer.findByAndUpdate(id, {
        $set: {
            name: data.name,
            email: data.email,
            password: data.password,
        }
    })
}

exports.delete = async (id) => {
    await Customer.findOneAndRemove(req.body.id)
}