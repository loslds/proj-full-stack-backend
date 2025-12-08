
// /use-cases/empresa/empresas.route.ts
import { Router} from 'express';
import { EmpresasController } from './empresas.controller';
import { EmpresasRepository } from './empresas.repository';
import { dbSource } from '../../database';
import { empresascreateValidation, empresasupdateValidation } from './empresas.validation';
import { ParsedQs } from 'qs';

interface SearchQuery extends ParsedQs {
  id?: string;
  nome?: string;
  fantasy?: string;
}
const empresasRepository = new EmpresasRepository(dbSource);
const controller = new EmpresasController(empresasRepository);
const empresasRoute = Router();

// Tipagem para a rota de busca
interface SearchQuery {
  id?: string;
  nome?: string;
  fantasy?: string;
}

empresasRoute.get('/', controller.findAllEmpresas.bind(controller));
empresasRoute.post('/', empresascreateValidation, controller.createNewEmpresas.bind(controller));
empresasRoute.get('/:empresasId', controller.getOneEmpresasId.bind(controller));
empresasRoute.patch('/:empresasId', empresasupdateValidation, controller.updateIdEmpresas.bind(controller));
empresasRoute.delete('/:empresasId', controller.removeIdEmpresas.bind(controller));
empresasRoute.get('/by-one-name', controller.findOneEmpresasNome.bind(controller));
empresasRoute.get('/by-one-fantasy', controller.findOneEmpresasFantasy.bind(controller));
empresasRoute.get('/by-pessoas/:pessoasId', controller.findAllEmpresasPessoasId.bind(controller));
empresasRoute.get('/search', controller.searchByEmpresas.bind(controller));
empresasRoute.get('/details', controller.findAllEmpresasDetails.bind(controller));

export { empresasRoute as empresasRoutes };
