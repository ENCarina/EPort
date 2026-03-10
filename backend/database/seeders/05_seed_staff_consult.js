import db from '../../app/models/modrels.js';

async function up({context: QueryInterface}) {
  const pivotData = [
    // Dr. Kovács Antal - Kardiológia
    { staffId: 1, consultationId: 1, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 1, consultationId: 4, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 1, consultationId: 5, createdAt: new Date(), updatedAt: new Date() },

    // Dr. Tóth Tünde - Fogászat
    { staffId: 2, consultationId: 2, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 2, consultationId: 18, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 2, consultationId: 19, createdAt: new Date(), updatedAt: new Date() },

    // Dr. House Greg - Pszichiátria
    { staffId: 3, consultationId: 3, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 3, consultationId: 20, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 3, consultationId: 21, createdAt: new Date(), updatedAt: new Date() },

    // Dr. Farkas Dóra - Bőrgyógyászat
    { staffId: 5, consultationId: 6, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 5, consultationId: 7, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 5, consultationId: 8, createdAt: new Date(), updatedAt: new Date() },

    // Dr. Varga Márton - Kardiológia
    { staffId: 6, consultationId: 1, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 6, consultationId: 4, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 6, consultationId: 5, createdAt: new Date(), updatedAt: new Date() },

    // Dr. Szabó Réka - Gyermekgyógyászat
    { staffId: 7, consultationId: 9, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 7, consultationId: 10, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 7, consultationId: 11, createdAt: new Date(), updatedAt: new Date() },

    // Dr. Németh Bálint - Ortopédia
    { staffId: 8, consultationId: 12, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 8, consultationId: 13, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 8, consultationId: 14, createdAt: new Date(), updatedAt: new Date() },

    // Dr. Horváth Eszter - Nőgyógyászat
    { staffId: 9, consultationId: 15, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 9, consultationId: 16, createdAt: new Date(), updatedAt: new Date() },
    { staffId: 9, consultationId: 17, createdAt: new Date(), updatedAt: new Date() },
  ];

  if(db && db.staff_consult) {
    await db.staff_consult.bulkCreate(pivotData);
  } else {
    await QueryInterface.bulkInsert('staff_consult', pivotData);
  }
}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('staff_consult', null, {});
}

export { up, down }
