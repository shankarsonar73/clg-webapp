import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false, // Set to true to log SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Function to check database connection
const testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Database Connected Successfully!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Call the function to test connection
testDBConnection();

export default sequelize;
