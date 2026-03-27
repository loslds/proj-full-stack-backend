 
// C:\repository\proj-full-stack-backend\src\use-cases\cadastro\cadastros.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import {
  cadastrosCreateSchema,
  cadastrosUpdateSchema
} from './cadastros.dto';

export const cadastroscreateValidation = zodBodyValidation(cadastrosCreateSchema);
export const cadastrosupdateValidation = zodBodyValidation(cadastrosUpdateSchema);