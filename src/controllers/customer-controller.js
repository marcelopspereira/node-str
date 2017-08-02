'use sctrict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');

const authService = require('../services/auth-service');
const emailService = require('../services/email-service');


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

exports.authenticate = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.isEmail(req.body.email, 'O email inválido ');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres ');

    //se os dados forem invalidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });
        const token = authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles:customer.roles            
        });

        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }
        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};



exports.refreshToken = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.isEmail(req.body.email, 'O email inválido ');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres ');

    //se os dados forem invalidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }


        const tokenData = authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles:customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};



exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'O email inválido ');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres ');

    //se os dados forem invalidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {

        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ['user']
        })

        emailService.send(req.body.email,
            'Bem Vindo ao Node Store',
            global.EMAIL_TLP.replace('{0}', req.body.name))
        res.status(201).send({
            message: 'Usuário cadastraado com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }

};

exports.put = async(req, res, next) => {
    try {
        await repository.update(req.param.id, req.body);
        res.status(201).send({
            message: 'Customer atualizado com sucesso!'
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
            message: 'Customer removido com sucesso!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};