import { DataTypes } from 'sequelize'
import sequelize from '../database/database.js'

const Staffconsult = sequelize.define('staffconsults', {
    name: { type: DataTypes.STRING,  allowNull: false  }
}, {
    timestamps: true,
    freezeTableName: true
})

export default Staffconsult
