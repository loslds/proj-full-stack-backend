
// C:\repository\proj-full-stack-backend\src\use-cases\chave\chaves.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { chavesCreateSchema, chavesUpdateSchema } from './chaves.dto';

export const chavescreateValidation = zodBodyValidation(chavesCreateSchema);
export const chavesupdateValidation = zodBodyValidation(chavesUpdateSchema);

