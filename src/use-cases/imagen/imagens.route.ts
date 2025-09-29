
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
imagensRoute.get('/', controller.findAllImagens.bind(controller));
imagensRoute.post('/', imagenscreateValidation, controller.createNewImagens.bind(controller));
imagensRoute.get('/:imagensId', controller.getOneImagensId.bind(controller));
imagensRoute.patch('/:imagensId', imagensupdateValidation, controller.updateIdImagens.bind(controller));
imagensRoute.delete('/:imagensId', controller.removeIdImagens.bind(controller));
imagensRoute.get('/search', controller.searchImagens.bind(controller));
imagensRoute.get('/search-arqTipo', controller.searchImagensArqTipo.bind(controller));
imagensRoute.get('/search-arqName', controller.searchImagensArqName.bind(controller));
imagensRoute.get('/one-arqNome', controller.findOneImagensArqNome.bind(controller));
imagensRoute.get('/all-arqTipo', controller.findAllImagensArqTipo.bind(controller));
imagensRoute.get('/all-arqNome', controller.findAllImagensArqNome.bind(controller));



export { imagensRoute, imagensRepository };

