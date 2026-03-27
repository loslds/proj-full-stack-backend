

// C:\repository\proj-full-stack-backend\src\use-cases\cliente\clientes.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import {
  clientesCreateSchema,
  clientesUpdateSchema
} from './clientes.dto';

export const clientescreateValidation = zodBodyValidation(clientesCreateSchema);
export const clientesupdateValidation = zodBodyValidation(clientesUpdateSchema);