import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATA_DIR: path.resolve(__dirname, '../data'),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://ledgerdb:Amit%401234@cluster0.szlpwly.mongodb.net/viya_library?retryWrites=true&w=majority',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  ADMIN_PHONE: process.env.ADMIN_PHONE || '9685912333',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Amit1234'
};
