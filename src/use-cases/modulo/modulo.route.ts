import { Router } from 'express';

import { ModuloController } from './modulo.controller';
import { ModuloRepository } from './modulo.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './modulo.validation';

const moduloRepository = new ModuloRepository(dataSource);
const controller = new ModuloController(moduloRepository);
const moduloRoute = Router();

moduloRoute.get('/', (...n) => controller.findModuloAll(...n));
moduloRoute.post('/', createValidation, (...n) => controller.create(...n));
moduloRoute.get('/:moduloId', (...n) => controller.getOne(...n));
moduloRoute.patch('/:moduloId', updateValidation, (...n) =>
  controller.update(...n),
);
moduloRoute.delete('/:moduloId', (...n) => controller.remove(...n));

export { moduloRoute, moduloRepository };
