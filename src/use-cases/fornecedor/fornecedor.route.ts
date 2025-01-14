
import { Router, RequestHandler } from 'express';

import { FornecedorController } from './fornecedor.controller';
import { FornecedorRepository } from './fornecedor.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './fornecedor.validation';

const fornecedorRepository = new FornecedorRepository(dataSource);
const controller = new FornecedorController(fornecedorRepository);
const fornecedorRoute = Router();

fornecedorRoute.get('/', (req, res, next) => controller.findAll(req, res, next));
fornecedorRoute.post('/', createValidation, (req, res, next) => controller.create(req, res, next));
fornecedorRoute.get('/:fornecedorId', (req, res, next) => controller.getOne(req, res, next));

fornecedorRoute.patch('/:fornecedorId', updateValidation, controller.update as unknown as RequestHandler);
fornecedorRoute.delete('/:fornecedorId', (req, res, next) => controller.remove(req, res, next));
fornecedorRoute.get('/by-name', (req, res, next) => controller.findByName(req, res, next));
fornecedorRoute.get('/by-fantasy', (req, res, next) => controller.findByFantasy(req, res, next));
fornecedorRoute.get('/pessoa/:pessoaId', (req, res, next) => controller.findAllByPessoaId(req, res, next));
fornecedorRoute.get('/empresa/:empresaId', (req, res, next) => controller.findAllByEmpresaId(req, res, next));

export { fornecedorRoute, fornecedorRepository };
