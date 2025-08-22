
import { Router, RequestHandler } from 'express';

import { FornecedoresController } from './fornecedores.controller';
import { FornecedoresRepository } from './fornecedores.repository';
import { dataSource } from '../start/dbSource';
import { createValidation, updateValidation } from './fornecedores.validation';

const fornecedoresRepository = new FornecedoresRepository(dataSource);
const controller = new FornecedoresController(fornecedoresRepository);
const fornecedoresRoute = Router();

fornecedoresRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
fornecedoresRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
fornecedoresRoute.get('/:fornecedoresId', (req, res, next) => controller.getOne(req, res, next));

fornecedoresRoute.patch('/:fornecedoresId', updateValidation, controller.update as unknown as RequestHandler);
fornecedoresRoute.delete('/:fornecedoresId', (req, res, next) => controller.remove(req, res, next));
fornecedoresRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
fornecedoresRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
fornecedoresRoute.get('fornecedores/by-pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));
fornecedoresRoute.get('fornecedores/by-/empresa/:empresaId', (req, res, next) => controller.findAllByEmpresaId(req, res, next));

export { fornecedoresRoute, fornecedoresRepository };
