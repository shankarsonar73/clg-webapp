import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Faculty = sequelize.define('Faculty', {
  faculty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  department: {
    type: DataTypes.STRING(100)
  },
  designation: {
    type: DataTypes.STRING(100)
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Faculty.belongsTo(User, { foreignKey: 'user_id' });

export default Faculty;