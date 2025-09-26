
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
// GET todos os registros
pessoasRoute.get('/', controller.findAll.bind(controller));

// GET pesquisa por query (id, nome ou sigla)
pessoasRoute.get('/search', controller.search.bind(controller));

// GET pesquisa por nome
pessoasRoute.get('/search-name', controller.search.bind(controller));

// GET pesquisa por sigla
pessoasRoute.get('/search-sigla', controller.searchSigla.bind(controller));

// GET um registro por nome
pessoasRoute.get('/one-nome', controller.findOneNome.bind(controller));

// GET todos registros por nome
pessoasRoute.get('/all-nome', controller.findAllNome.bind(controller));

// GET um registro por sigla
pessoasRoute.get('/one-sigla', controller.findOneSigla.bind(controller));

// GET todos registros por sigla
pessoasRoute.get('/all-sigla', controller.findAllSigla.bind(controller));

// GET registro por ID (deve vir por último para não conflitar com outras rotas)
pessoasRoute.get('/:pessoasId', controller.getOne.bind(controller));

// POST cria novo registro
pessoasRoute.post('/', pessoascreateValidation, controller.create.bind(controller));

// PATCH atualiza registro
pessoasRoute.patch('/:pessoasId', pessoasupdateValidation, controller.update.bind(controller));

// DELETE remove registro
pessoasRoute.delete('/:pessoasId', controller.remove.bind(controller));

export { pessoasRoute, pessoasRepository };


