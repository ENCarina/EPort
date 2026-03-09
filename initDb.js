import sequelize from './app/database/database.js'
import './app/models/modrels.js'
import bcrypt from 'bcryptjs'

async function initializeDatabase() {
  try {
    // Sync tables
    await sequelize.sync({ force: true })
    console.log('✓ Tables synced')

    const User = sequelize.models.user
    const Role = sequelize.models.role
    const QueryInterface = sequelize.getQueryInterface()

    // Insert roles
    await QueryInterface.bulkInsert('roles', [
      { id: 0, name: 'user', createdAt: new Date(), updatedAt: new Date() },
      { id: 1, name: 'staff', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'admin', createdAt: new Date(), updatedAt: new Date() }
    ])
    console.log('✓ Roles seeded')

    // Insert users
    const doctorsPassword = bcrypt.hashSync('doctor123', 10)
    const adminPassword = bcrypt.hashSync('admin', 10)

    await QueryInterface.bulkInsert('users', [
      { id: 50, name: 'User', email: 'user@ep.com', password: bcrypt.hashSync('test1243', 10), roleId: 0, createdAt: new Date(), updatedAt: new Date() },
      { id: 101, name: 'Dr. Kovács Antal', email: 'dr.kovacs@ep.com', password: doctorsPassword, roleId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 102, name: 'Dr. Tóth Tünde', email: 'dr.toth@ep.com', password: doctorsPassword, roleId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 103, name: 'Dr. House Greg', email: 'dr.house@ep.com', password: doctorsPassword, roleId: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 100, name: 'Admin', email: 'admin@example.com', password: adminPassword, roleId: 2, createdAt: new Date(), updatedAt: new Date() }
    ])
    console.log('✓ Users seeded (demo: admin@example.com / admin)')

    // Insert staff
    await QueryInterface.bulkInsert('staff', [
      { id: 1, userId: 101, specialty: 'Kardiológus', isAvailable: true, bio: '20 éves szakmai tapasztalattal rendelkező szakorvos.', imageUrl: 'https://example.com/images/dr_kovacs.jpg', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, userId: 102, specialty: 'Fogorvos', isAvailable: true, bio: '15 éves nemzetközi tapasztalattal rendelkező fogorvos.', imageUrl: 'https://example.com/images/dr_toth.jpg', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, userId: 103, specialty: 'Pszichiáter', isAvailable: true, bio: 'Amerikai főorvos.', imageUrl: 'https://example.com/images/dr_house.jpg', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, userId: 100, specialty: 'Vezető asszisztens', isAvailable: true, bio: 'Laborvizsgálatok és adminisztráció felelőse.', imageUrl: null, createdAt: new Date(), updatedAt: new Date() }
    ])
    console.log('✓ Staff seeded')

    // Insert consultations
    await QueryInterface.bulkInsert('consultations', [
      { id: 1, name: 'Kardiológiai vizsgálat', description: 'Szív- és érrendszeri alapvizsgálat', specialty: 'Kardiológia', duration: 60, price: 25000, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Fogászati konzultáció', description: 'Fogászati állapotfelmérés és konzultáció', specialty: 'Fogászat', duration: 45, price: 15000, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Pszichiátriai konzultáció', description: 'Pszichés állapot értékelése és tanácsadás', specialty: 'Pszichiátria', duration: 90, price: 35000, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Laborvizsgálat', description: 'Vér- és vizeletvizsgálat', specialty: 'Labor', duration: 30, price: 8000, createdAt: new Date(), updatedAt: new Date() }
    ])
    console.log('✓ Consultations seeded')

    // Insert sample slots for each staff member between 2026-03-10 and 2026-06-30
    const formatDate = (date) => date.toISOString().split('T')[0]

    const makeSlot = (staffId, consultationId, date, startHour) => {
      const start = new Date(date + 'T' + String(startHour).padStart(2, '0') + ':00:00')
      const end = new Date(start)
      end.setHours(startHour + 1)
      return {
        staffId,
        consultationId,
        date,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    const slotData = []
    const staffIds = [1, 2, 3, 4]

    // iterate through date range
    let current = new Date('2026-03-10')
    const endDate = new Date('2026-06-30')
    while (current <= endDate) {
      const dStr = formatDate(current)
      staffIds.forEach((sid) => {
        // two slots per day: 09:00 and 10:00
        slotData.push(makeSlot(sid, 1, dStr, 9))
        slotData.push(makeSlot(sid, 1, dStr, 10))
      })
      current.setDate(current.getDate() + 1)
    }

    await QueryInterface.bulkInsert('slots', slotData)
    console.log('✓ Slots seeded')

    console.log('✓ Database initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('✗ Error initializing database:', error.message)
    process.exit(1)
  }
}

initializeDatabase()
