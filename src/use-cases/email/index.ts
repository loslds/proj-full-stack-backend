

// C:\repository\proj-full-stack-backend\src\use-cases\email\index.ts
import { EmailsRepository } from './emails.repository';

export { EmailsController } from './emails.controller';
export { EmailsEntity } from './emails.entity';
export { EmailsRepository } from './emails.repository';
export { emailsRoutes } from './emails.route';

export * from './emails.dto';
export * from './emails.validation';

export const emailsConfig = {
  tableName: 'emails',
  repoClass: EmailsRepository,
  findAll: 'findEmailsAll'
};