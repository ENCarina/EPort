'use strict';

export async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert('bookings', [
    {
      name: 'Kardiológiai vizsgálat',
      patientId: 50,         // User
      staffId: 101,         // Dr. Kovács Antal
      consultationId: 1,    // Ellenőrizd, hogy a consultations táblában van-e 1-es!
      slotId: 1,
      status: 'Confirmed',
      duration: 30,
      startTime: '2026-03-10T08:00:00.000Z',
      endTime: '2026-03-10T08:30:00.000Z',
      price: 25000,
      isPublic: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Parandontológiai kiműtét',
      patientId: 50,         // User
      staffId: 102,         // Dr. Tóth Tünde
      consultationId: 2,    // Ellenőrizd a consultations táblát!
      slotId: 2,
      status: 'Confirmed',
      duration: 60,
      startTime: '2026-03-11T09:00:00.000Z',
      endTime: '2026-03-11T10:00:00.000Z',
      price: 15000,
      isPublic: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Pszichiátriai első konzultáció',
      patientId: 50,         // User
      staffId: 103,         // Dr. House Greg
      consultationId: 3,    // Ellenőrizd a consultations táblát!
      slotId: 3,
      status: 'Confirmed',
      duration: 60,
      startTime: '2026-03-10T10:00:00.000Z',
      endTime: '2026-03-10T11:00:00.000Z',
      price: 35000,
      isPublic: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});

  // Frissítjük a slotokat
  await queryInterface.sequelize.query('UPDATE slots SET isAvailable = 0 WHERE id IN (1, 2, 3)');
}

export async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete('bookings', null, {});
}