// Example of CORS configuration for Express backend
import express from 'express';
import cors from 'cors';

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5174', 'http://127.0.0.1:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rest of your Express app configuration... 