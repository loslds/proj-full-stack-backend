import { Router } from 'express';

import { PessoaController } from './pessoa.controller';
import { PessoaRepository } from './pessoa.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './pessoa.validation';

const pessoaRepository = new PessoaRepository(dataSource);
const controller = new PessoaController(pessoaRepository);
const pessoaRoute = Router();

pessoaRoute.get('/', (...n) => controller.findAll(...n));
pessoaRoute.post('/', createValidation, (...n) => controller.create(...n));
pessoaRoute.get('/:pessoaId', (...n) => controller.getOne(...n));
pessoaRoute.patch('/:pessoaId', updateValidation, (...n) =>
  controller.update(...n),
);
pessoaRoute.delete('/:pessoaId', (...n) => controller.remove(...n));

export { pessoaRoute, pessoaRepository };
