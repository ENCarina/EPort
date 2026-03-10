import db from '../models/modrels.js'

const { Staff, User, Consultation } = db;

const StaffController = {
    async index(req, res) {
        try {
            await StaffController.tryIndex(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryIndex(req, res) {
        const staff = await Staff.findAll({
            include: [{
                model: User,
                attributes:['name', 'email','roleId']
            }, {
                model: Consultation,
                as: 'services',
                attributes: ['id', 'name', 'description', 'specialty', 'duration', 'price'],
                through: { attributes: [] }
            }]
        })
        res.status(200)
        res.json({
            success: true,
            data: staff
        })
    },
    async show(req, res) {
        try {
            await StaffController.tryShow(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryShow(req, res) {
        const staff = await Staff.findByPk(req.params.id,{
            include: [{
                model: User,
                attributes:['name', 'email','roleId']
            }, {
                model: Consultation,
                as: 'services',
                attributes: ['id', 'name', 'description', 'specialty', 'duration', 'price'],
                through: { attributes: [] }
            }]
        })
        res.status(200)
        res.json({
            success: true,
            data: staff
        })
    },
    async store(req, res) {
        try {
            await StaffController.tryStore(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryStore(req, res) {
        const staff = await Staff.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: staff
        })
    },
    async update(req, res) {
        try {
            await StaffController.tryUpdate(req, res)
        }catch(error) {
            let actualMessage = '';
            if(error.message == 'Fail! Record not found!') {
                actualMessage = error.message
                res.status(404)
            }else {
                res.status(500)
                actualMessage = 'Fail! The query is failed!'
            }
            
            res.json({
                success: false,
                message: actualMessage
            })
        }
    },
    async tryUpdate(req, res) {
        const [recordNumber] = await Staff.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const staff = await Staff.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: staff
        })
    },
    async destroy(req, res) {
        try {
            await StaffController.tryDestroy(req, res)
        }catch(error) {
            res.status(500).json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryDestroy(req, res) {
        const staff = await Staff.destroy({
            where: { id: req.params.id }
        })
        res.status(200).json({
            success: true,
            data: staff
        })
    }
}

export default StaffController
