'use sctrict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
//const azure = require('azure-storage');
const cloudinary = require('cloudinary');

const guid = require('guid');
var config = require('../config');


exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data)
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.getBySlug = async(req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.param.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }

}

exports.getByTag = async(req, res, next) => {
    try {
        var data = await repository.getByTag(req.param.tag)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 ');
    contract.hasMinLen(req.body.slug, 3, 'O titulo deve conter pelo menos 3 ');
    contract.hasMinLen(req.body.description, 3, 'O titulo deve conter pelo menos 3 ');

    //se os dados forem invalidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        // Cria o Blob Service
        // const blobSvc = azure.createBlobService(config.containerConnectionString);
        //const blobSvc = azure.createBlobService(config.containerConnectionString);


        cloudinary.config({
          cloud_name: 'mps2017',
          api_key: '987328326747484',
          api_secret: '4wo_H-DKA4B4qUHx4Zb4p8m0EOI'
        });

        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        console.log("File :"+filename);
        // Salva a imagem
        // await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
        //     contentType: type
        // }, function (error, result, response) {
        //     if (error) {
        //         filename = 'default-product.png'
        //     }
        // });

        const destfolder = "product-images";
        await cloudinary.v2.uploader.upload(rawdata, {
            folder: destfolder,
            use_filename: false,
            tags: [destfolder]
        }, function (error, result) {
            if (error) {
                filename = 'default-product.png'
                console.log("error ocurred", error);
            } else {
                console.log("result of upload \n", result.secure_url, "\n insecure url: \n", result.url);
            }
        });


        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'https://res.cloudinary.com/mps2017/image/upload/v1501459755/product-images/' + filename
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.put = async(req, res, next) => {
    try {
        await repository.update(req.param.id, req.body);
        res.status(201).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }

};

exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};