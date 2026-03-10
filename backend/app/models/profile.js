import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Profile = sequelize.define('profiles', {
    name: { type: DataTypes.STRING,  allowNull: false  },
    specialty: { type: DataTypes.STRING, allowNull: true },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true }
}, {
    timestamps: true,
    freezeTableName: true
})

export default Profile
