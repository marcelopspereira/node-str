'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: [true, 'o email é obrigatorio'],
        trim: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    }
});

module.exports = mongoose.model('Customer', schema);