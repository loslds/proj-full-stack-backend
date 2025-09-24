
// C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.route.ts
import { dbSource } from '../../database';
import { Router } from 'express';
import { PessoasController } from './pessoas.controller';
import { PessoasRepository } from './pessoas.repository';
import { createValidation, updateValidation } from './pessoas.validation';

const pessoasRepository = new PessoasRepository(dbSource);
const controller = new PessoasController(pessoasRepository);
const pessoasRoute = Router();






// ======================= ROTAS =======================
// GET todos os registros
pessoasRoute.get('/', controller.findAll.bind(controller));

// GET pesquisa por query (id, nome ou sigla)
pessoasRoute.get('/search', controller.search.bind(controller));

// GET pesquisa por nome
pessoasRoute.get('/search-name', controller.searchByName.bind(controller));

// GET pesquisa por sigla
pessoasRoute.get('/search-sigla', controller.searchBySigla.bind(controller));

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
pessoasRoute.post('/', createValidation, controller.create.bind(controller));

// PATCH atualiza registro
pessoasRoute.patch('/:pessoasId', updateValidation, controller.update.bind(controller));

// DELETE remove registro
pessoasRoute.delete('/:pessoasId', controller.remove.bind(controller));

export { pessoasRoute, pessoasRepository };



// src/use-cases/pessoa/pessoas.route.ts

// import { Router } from "express";
// import { PessoasController } from "./pessoas.controller";
// import { PessoasRepository } from "./pessoas.repository";
// import { createValidation, updateValidation } from "./pessoas.validation";
// import { dbSource } from "../../database";
import { dbSource } from '../../database';
import { Router, Request, Response, NextFunction } from 'express';
import { SystablesController } from './systables.controller';
import { SystablesRepository } from './systables.repository';
import { createValidation, updateValidation } from './systables.validation';

// export const initPessoasRoutes = async (app: any) => {
//   const repo = new PessoasRepository(dbSource);
//   //await repo.createNotExistsPessoas();
//   //await repo.insertDefaultPessoas();

//   const controller = new PessoasController(repo);
//   const router = Router();

//   router.get("/", controller.findAll.bind(controller));
//   router.get("/search", controller.search.bind(controller));
//   router.get("/search-name", controller.searchByName.bind(controller));
//   router.get("/search-sigla", controller.searchBySigla.bind(controller));
//   router.get("/one-nome", controller.findOneNome.bind(controller));
//   router.get("/all-nome", controller.findAllNome.bind(controller));
//   router.get("/one-sigla", controller.findOneSigla.bind(controller));
//   router.get("/all-sigla", controller.findAllSigla.bind(controller));
//   router.get("/:pessoasId", controller.getOne.bind(controller));

//   router.post("/", createValidation, controller.create.bind(controller));
//   router.patch("/:pessoasId", updateValidation, controller.update.bind(controller));
//   router.delete("/:pessoasId", controller.remove.bind(controller));

//   // monta o Router no app principal
//   app.use("/api/pessoas", router);
// };

// import { Router } from 'express';
// import { PessoasController } from './pessoas.controller';
// import { createValidation, updateValidation } from './pessoas.validation';

// export const pessoasRoute = (controller: PessoasController) => {
//   const router = Router();

//   // ======================= ROTAS =======================
//   router.get('/', controller.findAll.bind(controller));
//   router.get('/search', controller.search.bind(controller));
//   router.get('/search-name', controller.searchByName.bind(controller));
//   router.get('/search-sigla', controller.searchBySigla.bind(controller));
//   router.get('/one-nome', controller.findOneNome.bind(controller));
//   router.get('/all-nome', controller.findAllNome.bind(controller));
//   router.get('/one-sigla', controller.findOneSigla.bind(controller));
//   router.get('/all-sigla', controller.findAllSigla.bind(controller));
//   router.get('/:pessoasId', controller.getOne.bind(controller));
//   router.post('/', createValidation, controller.create.bind(controller));
//   router.patch('/:pessoasId', updateValidation, controller.update.bind(controller));
//   router.delete('/:pessoasId', controller.remove.bind(controller));

//   return router;
// };











// // C:\repository\proj-full-stack-backend\src\use-cases\pessoa\pessoas.route.ts
// import { dbSource } from '../../database';
// import { Router } from 'express';
// import { PessoasController } from './pessoas.controller';
// import { PessoasRepository } from './pessoas.repository';
// import { createValidation, updateValidation } from './pessoas.validation';

// const pessoasRepository = new PessoasRepository(dbSource);
// const controller = new PessoasController(pessoasRepository);
// const pessoasRoute = Router();

// // Opcional: insere registros default ao iniciar (se tabela vazia)
// (async () => {
//   await pessoasRepository.createNotExistsPessoas();
//   await pessoasRepository.insertDefaultPessoas();
// })();

// // ======================= ROTAS =======================
// // GET todos os registros
// pessoasRoute.get('/', controller.findAll.bind(controller));

// // GET pesquisa por query (id, nome ou sigla)
// pessoasRoute.get('/search', controller.search.bind(controller));

// // GET pesquisa por nome
// pessoasRoute.get('/search-name', controller.searchByName.bind(controller));

// // GET pesquisa por sigla
// pessoasRoute.get('/search-sigla', controller.searchBySigla.bind(controller));

// // GET um registro por nome
// pessoasRoute.get('/one-nome', controller.findOneNome.bind(controller));

// // GET todos registros por nome
// pessoasRoute.get('/all-nome', controller.findAllNome.bind(controller));

// // GET um registro por sigla
// pessoasRoute.get('/one-sigla', controller.findOneSigla.bind(controller));

// // GET todos registros por sigla
// pessoasRoute.get('/all-sigla', controller.findAllSigla.bind(controller));

// // GET registro por ID (deve vir por último para não conflitar com outras rotas)
// pessoasRoute.get('/:pessoasId', controller.getOne.bind(controller));

// // POST cria novo registro
// pessoasRoute.post('/', createValidation, controller.create.bind(controller));

// // PATCH atualiza registro
// pessoasRoute.patch('/:pessoasId', updateValidation, controller.update.bind(controller));

// // DELETE remove registro
// pessoasRoute.delete('/:pessoasId', controller.remove.bind(controller));

// export { pessoasRoute, pessoasRepository };
