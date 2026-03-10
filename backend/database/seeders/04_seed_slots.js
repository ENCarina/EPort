import db from '../../app/models/modrels.js';

function generateTimeSlots() {
  const slots = [];

  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startHourStr = String(hour).padStart(2, '0');
      const minuteStr = String(minute).padStart(2, '0');
      const nextMinute = minute + 30;
      
      let nextHour = hour;
      let nextMinuteStr = String(nextMinute).padStart(2, '0');
      
      if (nextMinute >= 60) {
        nextHour = hour + 1;
        nextMinuteStr = '00';
      }
      
      const nextHourStr = String(nextHour).padStart(2, '0');
      
      slots.push({
        startTime: `${startHourStr}:${minuteStr}:00`,
        endTime: `${nextHourStr}:${nextMinuteStr}:00`
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
  
  const timeSlots = generateTimeSlots();
  const staffIds = [1, 2, 3, 5, 6, 7, 8, 9];
  const consultationsByStaff = {
    1: [1, 4, 5],
    2: [2, 18, 19],
    3: [3, 20, 21],
    5: [6, 7, 8],
    6: [1, 4, 5],
    7: [9, 10, 11],
    8: [12, 13, 14],
    9: [15, 16, 17]
  };
  const dates = generateDateRange(new Date('2026-03-10'), new Date('2026-06-30'));
  
  const slotsData = [];
  
  // Generate slots for each combination of staff, consultation, and date
  const now = new Date();

  dates.forEach(date => {
    staffIds.forEach((staffId) => {
      const staffConsultations = consultationsByStaff[staffId] || [1];

      timeSlots.forEach((timeSlot, slotIndex) => {
        slotsData.push({
          staffId: staffId,
          consultationId: staffConsultations[slotIndex % staffConsultations.length],
          date: date,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          isAvailable: true,
          createdAt: now,
          updatedAt: now
        });
      });
    });
  });
  
  if (db && db.Slot) {
    await db.Slot.bulkCreate(slotsData);
  } else {
    await QueryInterface.bulkInsert('slots', slotsData);
  }
}

async function down({context: QueryInterface}) {
  await QueryInterface.bulkDelete('slots', null, {});
}

export { up, down };