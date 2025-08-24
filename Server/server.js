import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './src/config/dbConfig.js';
import dotenv from 'dotenv';
import Auth from './src/routes/Auth.js';
import Post from './src/routes/api/Post.js';
import Comment from './src/routes/api/comment.js';
import { Server } from 'socket.io';
import http from 'http';
import configureSocket from './src/config/socket.js';
import passport from 'passport';
import configurePassport from './src/config/passportConfig.js';
import imageRoutes from './src/routes/api/imageRoutes.js';
import WikiRoutes from './src/routes/api/WikiRoutes.js';
import { setupUploadDirectory } from './src/utils/fileUtils.js';
import errorHandler from './src/middleware/errorHandler.js';
import vectorDb from './src/config/vectorDb.cjs';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = configureSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    await vectorDb.createIndex();
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    app.use(cors({
      origin: isDevelopment
        ? ['http://127.0.0.1:5173', 'http://localhost:5173']
        : [
            'https://product-support-hub.onrender.com',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://product-support-hub.vercel.app',
          ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    if (!isDevelopment) {
      app.use((req, res, next) => {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
      });
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
    app.set('io', io);
    app.use(errorHandler);

    configurePassport();

    app.use('/api/auth', Auth);
    app.use('/api/post', Post);
    app.use('/api/comment', Comment);
    app.use('/api/image', imageRoutes);
    app.use('/api/wiki', WikiRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    });

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();