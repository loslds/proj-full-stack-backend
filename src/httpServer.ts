
// src/server.ts (ou onde for o seu ponto de entrada)
import express from 'express';
import cors from 'cors';
import dbRoutes from './routes/dbRoutes';  
import { errorHandler } from './services/errorHandler';

const app = express();

// Middleware para permitir CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // URL do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Permite o uso de JSON no corpo das requisições
app.use(express.json());

// Rotas de banco de dados (http://localhost:3001/api/db/...)
app.use('/api/db', dbRoutes);

// Rota raiz apenas para teste
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Servidor online 🚀' });
});

// Middleware para tratar erros
app.use(errorHandler);

// Inicializa o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});

