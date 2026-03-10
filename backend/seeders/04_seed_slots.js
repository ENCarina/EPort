import db from '../../app/models/modrels.js';

function generateHalfHourTimeSlots() {
  const slots = [];

  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startHour = String(hour).padStart(2, '0');
      const startMinute = String(minute).padStart(2, '0');

      const endTotalMinutes = hour * 60 + minute + 30;
      const endHour = String(Math.floor(endTotalMinutes / 60)).padStart(2, '0');
      const endMinute = String(endTotalMinutes % 60).padStart(2, '0');

      slots.push({
        startTime: `${startHour}:${startMinute}:00`,
        endTime: `${endHour}:${endMinute}:00`
      });
    }
  }

  return slots;
}

function generateDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

async function up({context: QueryInterface}) {

  await QueryInterface.bulkDelete('slots', null, {});

  const staffIds = [1, 2, 3];
  const consultationByStaff = {
    1: 1,
    2: 2,
    3: 3
  };

  const dates = generateDateRange(new Date('2026-03-10'), new Date('2026-06-30'));
  const timeSlots = generateHalfHourTimeSlots();
  const now = new Date();

  const slotsData = [];

  for (const date of dates) {
    for (const staffId of staffIds) {
      for (const timeSlot of timeSlots) {
        slotsData.push({
          staffId,
          consultationId: consultationByStaff[staffId],
          date,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          isAvailable: true,
          createdAt: now,
          updatedAt: now
        });
      }
    }
  }

    if (db && db.Slot) {
        await db.Slot.bulkCreate(slotsData);
      }else {
        await QueryInterface.bulkInsert('slots', slotsData);
  }
}

async function down(QueryInterface, Sequelize) {
  await QueryInterface.bulkDelete('slots', null, {});
  }

export { up, down };