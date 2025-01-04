import { Router } from 'express';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './user.validation';

const userRepository = new UserRepository(dataSource);
const controller = new UserController(userRepository);
const userRoute = Router();

userRoute.get('/', (...n) => controller.findAll(...n));
userRoute.post('/', createValidation, (...n) => controller.create(...n));
userRoute.get('/:userId', (...n) => controller.getOne(...n));
userRoute.patch('/:userId', updateValidation, (...n) =>
  controller.update(...n),
);
userRoute.delete('/:userId', (...n) => controller.remove(...n));

export { userRoute, userRepository };
