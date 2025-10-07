// /use-cases/consumidor/consumidores.validation.ts 

import { zodBodyValidation } from '../../helpers/zod-validation';
import { clientesCreateSchema, clientesUpdateSchema } from './clientes.dto';

export const clientescreateValidation = zodBodyValidation(clientesCreateSchema);
export const clientesupdateValidation = zodBodyValidation(clientesUpdateSchema);
