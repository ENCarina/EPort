import { DataTypes } from 'sequelize';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }    
  });
}

async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('roles');
}

export { up, down };
