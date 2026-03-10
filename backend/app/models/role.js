import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Role = sequelize.define('role', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
})

export default Role
