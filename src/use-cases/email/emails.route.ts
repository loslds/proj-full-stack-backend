// C:\repository\proj-full-stack-backend\src\use-cases\email\emails.route.ts
import { Router } from 'express';
import { AppDataSource } from '../../config/db';
import { EmailsController } from './emails.controller';
import { EmailsRepository } from './emails.repository';
import {
  emailscreateValidation,
  emailsupdateValidation
} from './emails.validation';

const emailsRepository = new EmailsRepository(AppDataSource);
const controller = new EmailsController(emailsRepository);
const emailsRoute = Router();

// ==========================================================
// ROTAS FIXAS
// ==========================================================

// GET → Lista todos
emailsRoute.get('/', controller.findAllEmails.bind(controller));

// GET → Pesquisa combinada
emailsRoute.get('/search', controller.searchEmailsAll.bind(controller));

// GET → Pesquisa parcial (text)
emailsRoute.get('/search-text', controller.searchEmailsParcial.bind(controller));

// GET → Busca um email exato
emailsRoute.get('/one-email', controller.findOneEmailsEmail.bind(controller));

// GET → Busca todos emails exatos
emailsRoute.get('/all-email', controller.findAllEmailsEmail.bind(controller));

// GET → Busca um email_resgate exato
emailsRoute.get('/one-email-resgate', controller.findOneEmailsEmailResgate.bind(controller));

// GET → Busca todos email_resgate
emailsRoute.get('/all-email-resgate', controller.findAllEmailsEmailResgate.bind(controller));

// GET → Busca por cadastro
emailsRoute.get('/cadastros/:cadastrosId', controller.findAllEmailsCadastrosId.bind(controller));

// GET → Details
emailsRoute.get('/details', controller.listAllEmailsDetails.bind(controller));

// POST → Criar
emailsRoute.post('/', emailscreateValidation, controller.createNewEmails.bind(controller));

// ==========================================================
// ROTAS DINÂMICAS
// ==========================================================

// GET → Buscar por ID
emailsRoute.get('/:emailsId', controller.getOneEmailsId.bind(controller));

// PATCH → Atualizar
emailsRoute.patch('/:emailsId', emailsupdateValidation, controller.updateIdEmails.bind(controller));

// DELETE → Remover
emailsRoute.delete('/:emailsId', controller.removeIdEmails.bind(controller));

export { emailsRoute as emailsRoutes };