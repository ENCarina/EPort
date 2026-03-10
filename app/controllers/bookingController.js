import { BookingService } from '../services/bookingService.js';
import db from '../models/modrels.js';
import { EmailService } from '../services/emailService.js';

const BookingController = {
    async index(req, res) {
        try {
            const currentUserId = req.user?.id || req.userId;
            const currentUserRole = req.user?.roleId;
            
            if (!currentUserId) {
                return res.status(401).json({ success: false, error: 'User not authenticated' });
            }

            let whereClause = { patientId: currentUserId };

            if (currentUserRole === 1) {
                const staffRecord = await db.Staff.findOne({ where: { userId: currentUserId } });

                if (!staffRecord) {
                    return res.status(200).json({ success: true, data: [] });
                }

                whereClause = { staffId: staffRecord.id };
            }
            
            const bookings = await db.Booking.findAll({
                where: whereClause,
                include: [
                    { model: db.User, as: 'patient', attributes: ['name', 'email'] },
                    { model: db.Staff, as: 'doctor', include: [{ model: db.User, attributes: ['name'] }], attributes: ['id', 'specialty'] },
                    { model: db.Slot, attributes: ['date', 'startTime', 'endTime'] },
                    { model: db.Consultation, as: 'type', attributes: ['name', 'price'] }
                ]
            });
            
            console.log('Bookings found:', bookings.length);
            res.status(200).json({ success: true, data: bookings });
        } catch (error) {
            console.error('Booking index error:', error);
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
    let t;
    try {
        t = await db.sequelize.transaction();

        const currentUserId = req.user?.id || req.userId;
        const { slotId, consultationId } = req.body;

        if (!currentUserId) throw new Error("Nincs bejelentkezett felhasználó!");

        // 1. Slot lekérése tranzakcióval
        const slot = await db.Slot.findByPk(slotId, { transaction: t });
        if (!slot || !slot.isAvailable) {
            throw new Error("Az időpont már nem elérhető vagy nem létezik!");
        }
        // 2. Kritikus ellenőrzés: Létezik az orvos a Staff táblában?
        const staffExists = await db.Staff.findByPk(slot.staffId, { transaction: t });
        if (!staffExists) {
            throw new Error(`Adatbázis hiba: A megadott orvos (ID: ${slot.staffId}) nem található a Staff táblában!`);
        }

        // 3. Felhasználó és Konzultáció ellenőrzése
        const userExists = await db.User.findByPk(currentUserId, { transaction: t });
        const targetConsultationId = consultationId || slot.consultationId;
        const consultationExists = await db.Consultation.findByPk(targetConsultationId, { transaction: t });

        if (!userExists) throw new Error("A felhasználó nem található!");
        if (!consultationExists) throw new Error("A konzultációs típus nem található!");

        // 4. Időpont formázása
        const fullStartTime = new Date(`${slot.date}T${slot.startTime || "09:00:00"}`);
        const fullEndTime = new Date(`${slot.date}T${slot.endTime || "09:30:00"}`);

        // 5. Booking létrehozása
        const newBooking = await db.Booking.create({
            name: `Foglalás - ${userExists.name || currentUserId}`,
            patientId: currentUserId, 
            staffId: slot.staffId,
            slotId: slot.id,
            consultationId: targetConsultationId,
            duration: consultationExists.duration || 30,
            startTime: fullStartTime,
            endTime: fullEndTime,
            status: 'Confirmed',
            price: consultationExists.price || 0,
            isPublic: false,
        }, { transaction: t });

        // 6. Slot frissítése
        await db.Slot.update(
            { isAvailable: false }, 
            { where: { id: slotId }, transaction: t }
        );

        await t.commit();

        // Email küldés (nem blokkolja a választ)
        EmailService.sendBookingConfirmation(userExists.email || "teszt@email.hu", newBooking)
            .catch(err => console.error("Email hiba:", err));

        return res.status(201).json({
            success: true,
            message: 'Sikeres foglalás!',
            data: newBooking
        });

    } catch (error) {
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error("FOGLALÁSI HIBA:", error.message);
        return res.status(400).json({
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
        const t = await db.sequelize.transaction();
        try {
            const currentUserId = req.user?.id || req.userId;
            const currentUserRole = req.user?.roleId;

            const booking = await db.Booking.findByPk(req.params.id);
            if (!booking) throw new Error("Foglalás nem található!");

            if (currentUserRole === 1) {
                const staffRecord = await db.Staff.findOne({ where: { userId: currentUserId } });
                if (!staffRecord || booking.staffId !== staffRecord.id) {
                    await t.rollback();
                    return res.status(403).json({ success: false, error: 'Nincs jogosultság a foglalás törléséhez.' });
                }
            } else if (booking.patientId !== currentUserId) {
                await t.rollback();
                return res.status(403).json({ success: false, error: 'Nincs jogosultság a foglalás törléséhez.' });
            }
            
            await db.Slot.update(
                { isAvailable: true }, 
                { where: { id: booking.slotId }, transaction: t }
            );

            await booking.destroy({ transaction: t });
            await t.commit();

            res.status(200).json({ 
                success: true, 
                message: 'Törölve és felszabadítva.' 
            });
        } catch (error) {
            await t.rollback();
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

export default BookingController
