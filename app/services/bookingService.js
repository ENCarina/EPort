import db from '../models/modrels.js';
import { EmailService } from './emailService.js';

export const BookingService = {
    
    // 1. Új foglalás létrehozása
    async createBooking(bookingData, user) {
        // validáció
        if (new Date(bookingData.appointment_date) < new Date()) {
            throw new Error('Nem foglalható időpont a múltba!');
        }
        const t = await db.sequelize.transaction();
        try {
            const slot = await db.Slot.findByPk(bookingData.slotId, { transaction: t });
            if (!slot || !slot.isAvailable) {
                throw new Error('Ez az időpont már foglalt!');
            }

        const newBooking = await db.Booking.create({
            ...bookingData,
            patientId:user.id, 
            status: 'Confirmed'
        }, { transaction: t});

        await slot.update({ isAvailable: false }, { transaction: t });
        await t.commit();

        // E-mail küldés
        await EmailService.sendBookingConfirmation(user.email, newBooking).catch(err => {
            console.error('E-mail hiba:', err);
        });

        return newBooking;
    } catch (error) {
        await t.rollback();
        throw error;
    }   
    },
    // 2. Szabad időpontok keresése szűréssel
    async getAvailableSlots(staffId, date) {
        return await db.Slot.findAll({
            where: { 
                staffId: Number(staffId),
                date: date,
                isAvailable: true 
            }
        });
    },

    // 3. Foglalás lemondása speciális szabályokkal
    async cancelBooking(bookingId, userId) {
        const booking = await db.Booking.findByPk(bookingId);
        
        if (!booking) throw new Error('Foglalás nem található!');
        if (booking.patientId !== userId) throw new Error('Nincs jogosultságod a lemondáshoz!');

        // 24 órán belül már nem mondható le online
        const now = new Date();
        const bookingDate = new Date(booking.appointment_date);
        const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            throw new Error('A foglalás 24 órán belül már nem mondható le online, kérjük telefonáljon!');
        }

        return await booking.destroy();
    }
};