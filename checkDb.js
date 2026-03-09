import sequelize from './app/database/database.js'

async function checkData() {
  try {
    const [staffResult] = await sequelize.query('SELECT COUNT(*) as count FROM staff')
    const [userResult] = await sequelize.query('SELECT COUNT(*) as count FROM users')
    const [consultationResult] = await sequelize.query('SELECT COUNT(*) as count FROM consultations')
    const [slotResult] = await sequelize.query('SELECT COUNT(*) as count FROM slots')

    console.log('Database status:')
    console.log('Users:', userResult[0].count)
    console.log('Staff:', staffResult[0].count)
    console.log('Consultations:', consultationResult[0].count)
    console.log('Slots:', slotResult[0].count)

    if (staffResult[0].count === 0) {
      console.log('No staff data found. Need to seed database.')
    }

    // Show sample slots
    const [sampleSlots] = await sequelize.query('SELECT * FROM slots LIMIT 5')
    console.log('\nSample slots:')
    sampleSlots.forEach(slot => {
      console.log(`  Staff ${slot.staffId}, Date: ${slot.date}, Start: ${slot.startTime}, End: ${slot.endTime}`)
    })
  } catch (error) {
    console.error('Error checking database:', error.message)
  } finally {
    process.exit(0)
  }
}

checkData()