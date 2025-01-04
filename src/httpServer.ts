import express from 'express';
import cors from 'cors';
import { indexRoute } from './use-cases/index.route';

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000', // URL do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

app.use('/api', indexRoute); // Agora todas as rotas serão prefixadas com /api

// Inicializar o servidor
// app.listen(port, () => {
//   console.log(`Servidor rodando em http://localhost:${port}`);
// });

export { app as httpServer };
