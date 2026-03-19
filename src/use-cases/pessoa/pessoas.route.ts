

// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.route.ts

import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { PessoasController } from './pessoas.controller';
import { PessoasRepository } from './pessoas.repository';
import {
  pessoascreateValidation,
  pessoasupdateValidation
} from './pessoas.validation';

const pessoasRepository = new PessoasRepository(AppDataSource);
const controller = new PessoasController(pessoasRepository);
const pessoasRoute = Router();

// ==========================================================
// ROTAS FIXAS
// Sempre declarar antes das rotas com parâmetros dinâmicos
// ==========================================================

// GET -> Lista todas as pessoas
pessoasRoute.get(
  '/',
  controller.findAllPessoas.bind(controller)
);

// GET -> Pesquisa combinada
pessoasRoute.get(
  '/search',
  controller.searchPessoasAll.bind(controller)
);

// GET -> Pesquisa por nome aproximado
pessoasRoute.get(
  '/search-name',
  controller.searchPessoasNome.bind(controller)
);

// GET -> Pesquisa por sigla aproximada
pessoasRoute.get(
  '/search-sigla',
  controller.searchPessoasSigla.bind(controller)
);

// GET -> Busca uma pessoa por nome exato
pessoasRoute.get(
  '/one-nome',
  controller.findOnePessoasNome.bind(controller)
);

// GET -> Busca todas as pessoas por nome exato
pessoasRoute.get(
  '/all-nome',
  controller.findAllPessoasNome.bind(controller)
);

// GET -> Busca uma pessoa por sigla exata
pessoasRoute.get(
  '/one-sigla',
  controller.findOnePessoasSigla.bind(controller)
);

// GET -> Busca todas as pessoas por sigla exata
pessoasRoute.get(
  '/all-sigla',
  controller.findAllPessoasSigla.bind(controller)
);

// POST -> Cria nova pessoa
pessoasRoute.post(
  '/',
  pessoascreateValidation,
  controller.createNewPessoas.bind(controller)
);

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET -> Busca pessoa por ID
pessoasRoute.get(
  '/:pessoasId',
  controller.getOnePessoasId.bind(controller)
);

// PATCH -> Atualiza pessoa por ID
pessoasRoute.patch(
  '/:pessoasId',
  pessoasupdateValidation,
  controller.updateIdPessoas.bind(controller)
);

// DELETE -> Remove pessoa por ID
pessoasRoute.delete(
  '/:pessoasId',
  controller.removeIdPessoas.bind(controller)
);

export { pessoasRoute as pessoasRoutes };

