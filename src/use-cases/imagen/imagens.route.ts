// C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { ImagensController } from './imagens.controller';
import { ImagensRepository } from './imagens.repository';
import {
  imagenscreateValidation,
  imagensupdateValidation
} from './imagens.validation';

const imagensRepository = new ImagensRepository(AppDataSource);
const controller = new ImagensController(imagensRepository);

const imagensRoute = Router();

// ==========================================================
// ROTAS IMAGENS
// ==========================================================

// 1 - GET -> Lista todas as imagens
imagensRoute.get('/', controller.findAllImagens.bind(controller));

// 2 - POST -> Cria nova imagem
imagensRoute.post('/',imagenscreateValidation, controller.createNewImagens.bind(controller));

// 3 - GET -> Busca imagem por ID
imagensRoute.get('/id/:imagensId', controller.getOneIdImagens.bind(controller));

// 4 - PATCH -> Atualiza imagem por ID
imagensRoute.patch('/:imagensId', imagensupdateValidation, controller.updateIdImagens.bind(controller));

// 5 - DELETE -> Remove imagem por ID
imagensRoute.delete('/:imagensId', controller.removeImagensId.bind(controller));

// 6 - GET -> Pesquisa personalizada
imagensRoute.get('/search', controller.searchImagens.bind(controller));

// 7 - GET -> Pesquisa por nome parcial
imagensRoute.get('/search-nome', controller.searchNomeImagens.bind(controller));

// 8 - GET -> Pesquisa por tipo parcial
imagensRoute.get('/search-tipo', controller.searchTipoImagens.bind(controller));

// 9 - GET -> Busca uma imagem por nome exato
imagensRoute.get('/one-nome', controller.findOneNomeImagens.bind(controller));

// 10 - GET -> Busca uma imagem por tipo exato
imagensRoute.get('/one-tipo', controller.findOneTipoImagens.bind(controller));

// 11 - GET -> Busca todas as imagens por nome exato
imagensRoute.get('/all-nome', controller.findAllNomeImagens.bind(controller));

// 12 - GET -> Busca todas as imagens por tipo exato
imagensRoute.get('/all-tipo', controller.findAllTipoImagens.bind(controller));

// 13 - GET -> Busca uma imagem por path_dest
imagensRoute.get('/one-path-dest', controller.findOnePathDestImagens.bind(controller));

export { imagensRoute as imagensRoutes };