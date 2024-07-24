import dotenv from 'dotenv';
dotenv.config();
export default [
  process.env.ALLOWED_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3500',
  'https://fftbl6lt-5173.asse.devtunnels.ms',
  'https://fftbl6lt-3000.asse.devtunnels.ms',
];
