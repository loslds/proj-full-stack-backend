

// C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import {
  consumidoresCreateSchema,
  consumidoresUpdateSchema
} from './consumidores.dto';

export const consumidorescreateValidation = zodBodyValidation(consumidoresCreateSchema);
export const consumidoresupdateValidation = zodBodyValidation(consumidoresUpdateSchema);