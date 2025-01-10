
import { Router } from 'express';

import { EmpresaController } from './empresa.controller';
import { EmpresaRepository } from './empresa.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './empresa.validation';

const empresaRepository = new EmpresaRepository(dataSource);
const controller = new EmpresaController(empresaRepository);
const empresaRoute = Router();

empresaRoute.get('/', (...n) => controller.findEmpresaAll(...n));
empresaRoute.post('/', createValidation, (...n) => controller.create(...n));
empresaRoute.get('/:empresaId', (...n) => controller.getOne(...n));
empresaRoute.patch('/:empresaId', updateValidation, (...n) =>
  controller.update(...n),
);
empresaRoute.delete('/:empresaId', (...n) => controller.remove(...n));
empresaRoute.get('/', (...n) => controller.findByName(...n));
empresaRoute.get('/', (...n) => controller.findByFantasy(...n));
empresaRoute.get('/pessoa/:pessoaId', (...n) => controller.findAllByPessoaId(...n));

export { empresaRoute, empresaRepository };


