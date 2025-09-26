
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.route.ts
import { dbSource } from '../../database';
import { Router } from 'express';
import { ImagensController } from './imagens.controller';
import { ImagensRepository } from './imagens.repository';
import { imagenscreateValidation, imagensupdateValidation } from './imagens.validation';

const imagensRepository = new ImagensRepository(dbSource);
const controller = new ImagensController(imagensRepository);
const imagensRoute = Router();

// ======================= ROTAS =======================
// GET todos os registros
imagensRoute.get('/', controller.findAll.bind(controller));

// GET pesquisa por query (id, nome ou sigla)
imagensRoute.get('/search', controller.search.bind(controller));

// GET pesquisa por arqNome
imagensRoute.get('/search-arqName', controller.searchArqName.bind(controller));

// GET pesquisa por arqTipo
imagensRoute.get('/search-arqTipo', controller.searchArqTipo.bind(controller));

// GET um registro por arqNome
imagensRoute.get('/one-arqNome', controller.findOneArqNome.bind(controller));

// GET todos registros por nome
imagensRoute.get('/all-nome', controller.findAllArqNome.bind(controller));

// GET todos registros por sigla
imagensRoute.get('/all-arqTipo', controller.findAllArqTipo.bind(controller));

// GET registro por ID (deve vir por último para não conflitar com outras rotas)
imagensRoute.get('/:imagensId', controller.getOne.bind(controller));

// POST cria novo registro
imagensRoute.post('/', imagenscreateValidation, controller.create.bind(controller));

// PATCH atualiza registro
imagensRoute.patch('/:imagensId', imagensupdateValidation, controller.update.bind(controller));

// DELETE remove registro
imagensRoute.delete('/:imagensId', controller.remove.bind(controller));

export { imagensRoute, imagensRepository };


