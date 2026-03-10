import { DataTypes } from 'sequelize';

async function up({context: QueryInterface}) {
  await QueryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      references: {
        model: 'roles', 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET DEFAULT'
    },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() }    
  });
}

async function down({context: QueryInterface}) {
  await QueryInterface.dropTable('users');
}

export { up, down }
