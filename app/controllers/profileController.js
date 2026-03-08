import Profile from '../models/profile.js'
import db from '../models/modrels.js';
import { where } from 'sequelize';

const ProfileController = {
    async index(req, res) {
        try {
            const doctors = await db.Staff.findAll({
                where: { isAvailable: true },
                include: [{
                    model: db.User,
                    attributes:['name', 'email','roleId']
                }]
            });
            const formattedDoctors = doctors.map(doc => ({
                id: doc.userId,
                name: doc.user ? doc.user.name : 'Névtelen Orvos',
                specialty: doc.specialty,
                bio: doc.bio,
                imageUrl: doc.imageUrl ? `images/${doc.imageUrl}` : 'assets/default-doctor.png'
            }));
            res.status(200).json(formattedDoctors);
        }catch(error) {
            console.error('Hiba:', error);
            res.status(500).json({message: 'Szerver hiba.'})
        }
    },
    async tryIndex(req, res) {
        const profiles = await Profile.findAll()
        res.status(200)
        res.json({
            success: true,
            data: profiles
        })
    },
    async show(req, res) {
        try {
            const profile = await db.Staff.findByPk(req.params.id, {
                include: [{ model: db.User, attributes: ['name'] }]
            });
            if (!profile) return res.status(404).json({ success: false, message: 'Nincs találat' });
            res.status(200).json({ success: true, data: profile });
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
        const profile = await Profile.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: profile
        })
    },
    async store(req, res) {
        try {
            await ProfileController.tryStore(req, res)
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
        const profile = await Profile.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: profile
        })
    },
    async update(req, res) {
        try {
            const [updatedRows] = await db.Staff.update(req.body, {
                where: { id: req.params.id }
            });

            if (updatedRows === 0) {
                return res.status(404).json({ success: false, message: 'Record not found!' });
            }

            const updatedProfile = await db.Staff.findByPk(req.params.id);
            res.status(200).json({ success: true, data: updatedProfile });
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
        const recordNumber = await Profile.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const profile = await Profile.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: profile
        })
    },
    async destroy(req, res) {
        try {
            await ProfileController.tryDestroy(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryDestroy(req, res) {
        const profile = await Profile.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: profile
        })
    }
}

export default ProfileController;
