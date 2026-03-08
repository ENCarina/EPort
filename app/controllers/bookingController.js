import { BookingService } from '../services/bookingService.js';
import db from '../models/modrels.js';

const BookingController = {
    async index(req, res) {
        try {
            const bookings = await db.Booking.findAll({
                include: [
                    { model: db.User, as: 'patient', attributes: ['name', 'email'] },
                    { model: db.Staff, as: 'doctor', attributes: ['name', 'specialty'] }
                ]
            });
            res.status(200).json({ success: true, data: bookings });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async tryIndex(req, res) {
        const bookings = await db.Booking.findAll()
        res.status(200)
        res.json({
            success: true,
            data: bookings
        })
    },
    async show(req, res) {
        try {
            await BookingController.tryShow(req, res)
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
        const booking = await db.Booking.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: booking
        })
    },
    async store(req, res) {
        try {
            const currentUserId = req.userId;
            const { slotId } = req.body;
            
            const slot = await db.Slot.findByPk(slotId);

            if (!slot) {
            console.log("HIBA: A kiválasztott Slot nem létezik az adatbázisban!");
            return res.status(404).json({ success: false, message: "Időpont nem található!" });
            }

            if (!currentUserId) {
            return res.status(401).json({ message: "Felhasználó nem azonosítható!" });
            }
            //const booking = await BookingService.createBooking(req.body);
            const bookingData = req.body;
            console.log("--- UTOLSÓ ELLENŐRZÉS MENTÉS ELŐTT ---");
            console.log("PatientId (User):", currentUserId);
            console.log("StaffId (Doctor):", slot.staffId);
            console.log("SlotId:", slot.id);
            console.log("ConsultationId:", slot.consultationId);

            const newBooking = await db.Booking.create({
                // name: `Foglalás - ${currentUserId}`,
                // patientId: currentUserId, // A tokenből jövő ID
                // staffId: slot.staffId,
                // slotId: slot.id,
                // consultationId: slot.consultationId || 1,
                // duration: bookingData.duration || 30,
                // startTime: slot.startTime || "09:00",
                // date: slot.date,
                // status: 'Confirmed',
                // price: 0,
                // isPublic: false
                name: `Foglalás - Páciens ${currentUserId}`,
                patientId: currentUserId,   // 102
                staffId: slot.staffId,      // 2
                slotId: slot.id,           // 3
                consultationId: 1, 
                duration: 60,
                startTime: slot.startTime || "10:00",
                date: slot.date || "2026-03-02",
                status: 'Confirmed',
                price: 25000,
                isPublic: false
                });
            await db.Slot.update({ isAvailable: false }, { where: { id: bookingData.slotId } });

            res.status(201).json({
                success: true,
                message: 'Sikeres foglalás és visszaigazoló email elküldve!',
                data: newBooking
            });

        } catch (error) {
            console.error("KONTROLLER HIBA részletei:", error);
            res.status(400).json({
                success: false,
                error: error.message
                });
            }
        },
    async tryStore(req, res) {
        const booking = await db.Booking.create(req.body)
        res.status(201)
        res.json({
            success: true,
            data: booking
        })
    },
    async update(req, res) {
        try {
            await BookingController.tryUpdate(req, res)
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
        const recordNumber = await db.Booking.update(req.body, {
            where: { id: req.params.id }
        })
        if(recordNumber == 0) {
            throw new Error('Fail! Record not found!')
        }
        const booking = await db.Booking.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: booking
        })
    },
    async destroy(req, res) {
        try {
            await BookingService.deleteBooking(req.params.id);
            res.status(200).json({ 
                success: true, 
                message: 'Foglalás törölve, az időpont újra szabaddá vált.' 
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

export default BookingController
