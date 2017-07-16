'use sctrict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ValidationContract = require('../validators/fluent-validator')


exports.get = (req, res, next) => {
    Product
        .find({
            active: true
        }, 'title price slug')
        .then(data => {
            res.status(200).send(
                data
            );
        })
        .catch(e => {
            res.status(400).send(
                e
            );
        });

}

exports.getBySlug = (req, res, next) => {
    Product
        .findOne({
            slug: req.param.slug,
            active: true
        }, 'title description price slug tags')
        .then(data => {
            res.status(200).send(
                data
            );
        })
        .catch(e => {
            res.status(400).send(
                e
            );
        });

}

exports.getById = (req, res, next) => {
    Product
        .findOne({
            id: req.param.id
        })
        .then(data => {
            res.status(200).send(
                data
            );
        })
        .catch(e => {
            res.status(400).send(
                e
            );
        });

}

exports.getByTag = (req, res, next) => {
    Product
        .findOne({
            tags: req.param.tag,
            active: true
        }, 'title description price slug tags')
        .then(data => {
            res.status(200).send(
                data
            );
        })
        .catch(e => {
            res.status(400).send(
                e
            );
        });

}

exports.post = (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLne(req.body.title, 3, 'O título deve conter pelo menos 3 ');
    contract.hasMinLne(req.body.slug, 3, 'O titulo deve conter pelo menos 3 ');
    contract.hasMinLne(req.body.description, 3, 'O titulo deve conter pelo menos 3 ');

    //se os dados forem invalidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    var product = new Product(req.body);
    product
        .save()
        .then(x => {
            res.status(201).send(
                {
                    message: 'Produto ccadastraado com sucesso!'
                }
            );
        })
        .catch(e => {
            res.status(400).send(
                {
                    message: 'Falha ao cadastrar o produto!',
                    data: e
                }
            );
        });

};

exports.put = (req, res, next) => {
    Product.findByAndUpdate(req.param.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
            , slug: req.body.slug
        }
    }).then(x => {
        res.status(201).send({
            message: 'Produto atualizado com sucesso!'
        });
    }).catch(e => {
        res.status(400).send({
            message: 'Falha ao atualizar produto',
            data: e
        })
    })

};

exports.delete = (req, res, next) => {
    const id = req.param.id;
    Product.findOneAndRemove(req.body.id)
        .then(x => {
            res.status(200).send({
                message: 'Produto removido com sucesso!'
            });
        }).catch(e => {
            res.status(400).send({
                message: 'Falha ao remover produto',
                data: e
            })
        })
};
