'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        require: [true, 'o slug é obrigatorio'],
        trim: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    price: {
        type: Number,
        require: true
    },
    active: {
        type: Boolean,
        require: true,
        default: true
    },
    tags: [{
        type: String,
        require: true
    }],
    image: {
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('Product', schema);
//https://medium.com/technoetics/easiest-way-to-automate-image-upload-to-cloudinary-using-nodejs-5014b7cb629f
//http://cloudinary.com/documentation/node_image_upload