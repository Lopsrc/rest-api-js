const service = require('../services/user.service');
const validate = require('../utils/validation/user.validation');
const ApiError = require('../utils/error');

const logger = require('../utils/logger');

const getAllUsers = async function(req, res) {
    try {
        logger.info('Get all users');
        const user = await service.getAllUsers();

        res.send({status: 200, data: user});
    } catch (error) {
        logger.error(error.message);
        res.status(error?.status || 500).send({
            status: 'FAILED',
            data: { error: error?.message || error },
        });
    }
};

const getByEmail = async function(req, res) {
    try {
        logger.info('Get one user');
        const {email} = req.params;
        const err = validate.getUser(email)
        if (err) {
            throw err;
        }
        const user = await service.getByEmail(email);

        res.send({status: 'OK', data: user});
    } catch (error) {
        logger.error(error.message);
        res.status(error?.status || 500).send({
            status: 'FAILED',
            data: { error: error?.message || error },
        });
    }
};

const createUser = async function(req, res) {
    
    try {
        logger.info('Create new user');
        const {body} = req;
        const err =  validate.createUser(body);
        if (err) {
            throw err;
        }
        const id = await service.createUser({
            name: body.name,
            lastName: body.lastName,
            email: body.email,
            age: body.age,
        });

        res.status(201).send({status: 'OK', id: id});
    } catch (error) {
        logger.error(error.message);
        res.status(error?.status || 500).send({
            status: 'FAILED',
            data: { error: error?.message || error },
        });
    }
};

const updateUser = async function(req, res) {
    try {
        logger.info('Update one user');
        const {body} = req;
        const err =  validate.updateUser(body);
        if (err) {
            res.status(400).send({data: err.message});
            return;
        }
        const user = await service.updateUser({
            name: body.name,
            lastName: body.lastName,
            email: body.email,
            age: body.age,
        });
        res.send({status:'OK', data: user});
    } catch (error) {
        logger.error(error.message);
        res.status(error?.status || 500).send({
            status: 'FAILED',
            data: { error: error?.message || error },
        });
    }
};

const deleteUser = async function(req, res) {
    try {
        logger.info('Delete one user');
        const {params: {email}} = req;
        const err =  validate.deleteUser(email);
        if (err) {
            throw new ApiError(403,
                "email is not valid.",
            )
        }
        await service.deleteUser(email);
        res.send({status:'OK', isDel: true});
    } catch (error) {
        logger.error(error);
        res.status(error?.status || 500).send({
            status: 'FAILED',
            data: { error: error?.message || error },
        });
    }
};

const recoveryUser = async function(req, res) {
    try {
        logger.info('Recover one user');
        const {params: {email}} = req;
        const err =  validate.deleteUser(email);
        if (err) {
            throw new ApiError(403,
                "email is not valid.",
            )
        }
        await service.recoveryUser(email);
        res.send({status:'OK', isRec: true});
    } catch (error) {
        logger.error(error);
        res.status(error?.status || 500).send({
            status: 'FAILED',
            data: { error: error?.message || error },
        });
    }
};

module.exports = {
    getAllUsers,
    getByEmail,
    createUser,
    updateUser,
    deleteUser,
    recoveryUser,
};