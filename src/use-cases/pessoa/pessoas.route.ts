

// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.route.ts
import { dbSource } from '../../database';
import { Router } from 'express';
import { PessoasController } from './pessoas.controller';
import { PessoasRepository } from './pessoas.repository';
import { pessoascreateValidation, pessoasupdateValidation } from './pessoas.validation';

const pessoasRepository = new PessoasRepository(dbSource);
const controller = new PessoasController(pessoasRepository);
const pessoasRoute = Router();

// ======================= ROTAS FIXAS =======================
// Sempre colocar primeiro as rotas que NÃO possuem parâmetros
pessoasRoute.get('/', controller.findAllPessoas.bind(controller));

pessoasRoute.get('/search', controller.searchPessoasAll.bind(controller));
pessoasRoute.get('/search-name', controller.searchPessoasNome.bind(controller));
pessoasRoute.get('/search-sigla', controller.searchPessoasSigla.bind(controller));

pessoasRoute.get('/one-nome', controller.findOnePessoasNome.bind(controller));
pessoasRoute.get('/all-nome', controller.findAllPessoasNome.bind(controller));

pessoasRoute.get('/one-sigla', controller.findOnePessoasSigla.bind(controller));
pessoasRoute.get('/all-sigla', controller.findAllPessoasSigla.bind(controller));

pessoasRoute.post(
  '/',
  pessoascreateValidation,
  controller.createNewPessoas.bind(controller)
);

// ======================= ROTAS DINÂMICAS =======================
pessoasRoute.get('/:pessoasId', controller.getOnePessoasId.bind(controller));
pessoasRoute.patch(
  '/:pessoasId',
  pessoasupdateValidation,
  controller.updateIdPessoas.bind(controller)
);
pessoasRoute.delete('/:pessoasId', controller.removeIdPessoas.bind(controller));

// EXPORTAÇÃO
export { pessoasRoute as pessoasRoutes };
