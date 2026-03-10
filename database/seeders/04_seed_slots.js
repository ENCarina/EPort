import db from '../../app/models/modrels.js';

function generateTimeSlots() {
  // Generate 30-minute intervals from 08:00 to 20:00
  const slots = [];
  const startHour = 8;
  const endHour = 20;
  
  for (let hour = startHour; hour < endHour; hour++) {
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

async function up({context: QueryInterface}) {

  await QueryInterface.bulkDelete('slots', null, {});
  
  const timeSlots = generateTimeSlots();
  const staffIds = [1, 2, 3];
  const consultationIds = [1, 2, 3];
  const dates = ['2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13', '2026-03-14'];
  
  const slotsData = [];
  
  // Generate slots for each combination of staff, consultation, and date
  dates.forEach(date => {
    staffIds.forEach((staffId, staffIdx) => {
      timeSlots.forEach(timeSlot => {
        slotsData.push({
          staffId: staffId,
          consultationId: consultationIds[staffIdx % consultationIds.length],
          date: date,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date()
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

async function down(QueryInterface, Sequelize) {
  await QueryInterface.bulkDelete('slots', null, {});
  }

export { up, down };