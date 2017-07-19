'use sctrict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repostiory');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data)
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.param.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }

}

exports.post = async (req, res, next) => {
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

        await repository.create(req.body)
        res.status(201).send(
            {
                message: 'Usuário cadastraado com sucesso!'
            });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }

};

exports.put = async (req, res, next) => {
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

exports.delete = async (req, res, next) => {
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
