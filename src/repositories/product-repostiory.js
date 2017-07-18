'use strict'

const mongoose = require('mongoose');
const Product = mongoose.model('Product');


exports.get = () => {
    return Product
        .find({
            active: true
        }, 'title price slug');
}

exports.getBySlug = (slug) => {
    return Product
        .findOne({
            slug: slug,
            active: true
        }, 'title description price slug tags');
}

exports.getById = (id) => {
    return Product
        .findOne({
            id: id
        });
}

exports.getByTag = (tag) => {
    return Product
        .findOne({
            tags: tag,
            active: true
        }, 'title description price slug tags');

}


exports.create = (data) => {
    console.log(data);
    var product = new Product(data);
    return product.save()
}

exports.update = (id, data) => {
    return Product.findByAndUpdate(id, {
        $set: {
            title: data.title,
            description: data.description,
            price: data.price
            , slug: data.slug
        }
    })
}

exports.delete = (id) => {

    return Product.findOneAndRemove(req.body.id)

}