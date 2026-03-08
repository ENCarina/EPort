import db from '../models/modrels.js';
import { EmailService } from './emailService.js';

export const BookingService = {
    
    // 1. Új foglalás létrehozása
    async createBooking(bookingData, user) {
        // validáció
        if (new Date(bookingData.appointment_date) < new Date()) {
            throw new Error('Nem foglalható időpont a múltba!');
        }

        const newBooking = await db.Booking.create({
            ...bookingData,
            patientId: bookingData.patientId || req.user.id, 
            status: 'Confirmed'
        });

        // E-mail küldés az EmailService-el
        await EmailService.sendBookingConfirmation(user.email, newBooking);

        return newBooking;
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