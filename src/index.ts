import express from 'express';
import cors from 'cors';
import { startServer } from './startServer';
import { appPort } from './config/app';
import { dbSource } from './use-cases/start/dbSource';
import { indexRoute } from './use-cases/index.route'; // seu arquivo de rotas principal

const app = express();

// Middleware CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // URL do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Middleware para JSON
app.use(express.json());

// Registra suas rotas
app.use('/api', indexRoute);

// Inicia servidor + conexão banco
startServer(dbSource, app);


