import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Staff = sequelize.define('staff', {
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        unique: true 
    },
    bio: { type: DataTypes.TEXT, allowNull: true },
    specialty: { type: DataTypes.STRING, allowNull: true },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
}, {
    timestamps: true,
    freezeTableName: true
})

export default Staff
