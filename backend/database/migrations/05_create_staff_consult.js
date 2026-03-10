import { DataTypes } from 'sequelize';

async function up({context: QueryInterface}) {
  await QueryInterface.createTable('staff_consult', {
    staffId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references:{ model: 'staff', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    consultationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references:{ model: 'consultations', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() }    
  });
}

async function down({context: QueryInterface}) {
  await QueryInterface.dropTable('staff_consult');
}

export { up, down }
