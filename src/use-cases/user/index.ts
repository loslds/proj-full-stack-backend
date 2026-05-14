

// C:\repository\proj-full-stack-backend\src\use-cases\user\index.ts

import { UsersRepository } from './users.repository';

export { UsersController } from './users.controller';
export { UsersEntity } from './users.entity';
export { UsersRepository } from './users.repository';
export { usersRoutes } from './users.route';

export * from './users.dto';
export * from './users.validation';

export const usersConfig = {
  tableName: 'users',
  repoClass: UsersRepository,
  findAll: 'findUsersAll'
};
