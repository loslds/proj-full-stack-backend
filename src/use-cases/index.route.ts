
import { Router } from 'express';
import { datasysRoute } from './data_syss';
import { pessoasRoute } from './pessoas';
import { empresasRoute } from './empresas';

const indexRoute = Router();

// Suas rotas existentes
indexRoute.use('/data_sys', datasysRoute);
indexRoute.use('/pessoas', pessoasRoute);
indexRoute.use('/empresas', empresasRoute);

// Nova rota para teste de conexão com o banco
indexRoute.get('/db/check-connection', async (req, res) => {
  try {
    await req.app.get('dataSource').query('SELECT 1');
    return res.status(200).json({ success: true, message: 'Conexão com o banco OK ✅' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Falha na conexão com o banco ❌', error: err });
  }
});

indexRoute.get('/', (req, res) => {
  return res.status(200).send({ success: true }).end();
});

export { indexRoute };

