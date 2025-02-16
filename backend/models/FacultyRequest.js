import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const FacultyRequest = sequelize.define('FacultyRequest', {
  request_id: {
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
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  requested_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  approved_at: {
    type: DataTypes.DATE
  }
});

FacultyRequest.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
FacultyRequest.belongsTo(User, { as: 'approver', foreignKey: 'approved_by' });

export default FacultyRequest;