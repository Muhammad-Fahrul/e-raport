import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import corsOption from '../config/corsOption.js';
import authRoutes from '../routes/authRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import studentRoutes from '../routes/studentRoutes.js';
import raportRoutes from '../routes/raportRoutes.js';
import columnRoutes from '../routes/columnRoutes.js';
import recordRoutes from '../routes/recordRoutes.js';
import analysisRoutes from '../routes/analysisRoutes.js';
import collaboratorRoutes from '../routes/collaboratorRoutes.js';

import { errorHandler, notFound } from '../middleware/errorMiddleware.js';
import credentials from '../middleware/credentials.js';

const app = express();
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __dirname = path.resolve();

app.use(
  express.static(path.join(__dirname, 'frontend/dist'), {
    setHeaders: (res, filePath) => {
      console.log(path.extname(filePath));

      if (path.extname(filePath) === '.html') {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'max-age=31536000'); // Cache untuk file selain HTML
      }
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/raports', raportRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/collaborators', collaboratorRoutes);

// Middleware to set Cache-Control headers
// app.use(
//   express.static(path.join(__dirname, 'frontend/dist'), {
//     setHeaders: (res, filePath) => {
//       if (path.extname(filePath) === '.html') {
//         res.setHeader('Cache-Control', 'no-cache');
//       } else {
//         res.setHeader('Cache-Control', 'max-age=31536000'); // Cache untuk file selain HTML
//       }
//     },
//   })
// );

// // Middleware untuk menyajikan file statis dan mengatur header MIME type
// app.use(
//   express.static(path.join(__dirname, './frontend/dist'), {
//     setHeaders: (res, filePath) => {
//       if (path.extname(filePath) === '.js') {
//         res.setHeader('Content-Type', 'application/javascript');
//       }
//     },
//   })
// );

// Menangani semua permintaan lainnya dengan mengirimkan file index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend/dist', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

export default app;
