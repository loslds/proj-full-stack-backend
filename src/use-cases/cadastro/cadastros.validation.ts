// /use-cases/consumidor/cadastros.validation.ts 

import { zodBodyValidation } from '../../helpers/zod-validation';
import { cadastrosCreateSchema, cadastrosUpdateSchema } from './cadastros.dto';

export const cadastroscreateValidation = zodBodyValidation(cadastrosCreateSchema);
export const cadastrosupdateValidation = zodBodyValidation(cadastrosUpdateSchema);
