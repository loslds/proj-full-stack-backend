import { PessoasCreate } from './pessoas.dto';

// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.route.ts
import { dbSource } from '../../database';
import { Router } from 'express';
import { PessoasController } from './pessoas.controller';
import { PessoasRepository } from './pessoas.repository';
import { pessoascreateValidation, pessoasupdateValidation } from './pessoas.validation';

const pessoasRepository = new PessoasRepository(dbSource);
const controller = new PessoasController(pessoasRepository);
const pessoasRoute = Router();

// ======================= ROTAS =======================
pessoasRoute.get('/', controller.findAllPessoas.bind(controller));
pessoasRoute.post('/', pessoascreateValidation, controller.createNewPessoas.bind(controller));
pessoasRoute.get('/:pessoasId', controller.getOnePessoasId.bind(controller));
pessoasRoute.patch('/:pessoasId', pessoasupdateValidation, controller.updateIdPessoas.bind(controller));
pessoasRoute.delete('/:pessoasId', controller.removeIdPessoas.bind(controller));
pessoasRoute.get('/search', controller.searchPessoasAll.bind(controller));
pessoasRoute.get('/search-name', controller.searchPessoasName.bind(controller));
pessoasRoute.get('/search-sigla', controller.searchPessoasSigla.bind(controller));
pessoasRoute.get('/one-nome', controller.findOnePessoasNome.bind(controller));
pessoasRoute.get('/all-nome', controller.findAllPessoasNome.bind(controller));
pessoasRoute.get('/one-sigla', controller.findOnePessoasSigla.bind(controller));
pessoasRoute.get('/all-sigla', controller.findAllPessoasSigla.bind(controller));


export { pessoasRoute as pessoasRoutes };


