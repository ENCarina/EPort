import { DataTypes } from 'sequelize';

async function up({ context: QueryInterface }) {
  await QueryInterface.addColumn('users', 'taj', {
    type: DataTypes.STRING,
    allowNull: true
  });
}

async function down({ context: QueryInterface }) {
  await QueryInterface.removeColumn('users', 'taj');
}

export { up, down };
