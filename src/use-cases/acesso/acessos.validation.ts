
// C:\repository\proj-full-stack-backend\src\use-cases\acesso\acessos.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { acessosCreateSchema, acessosUpdateSchema } from './acessos.dto';

export const acessoscreateValidation = zodBodyValidation(acessosCreateSchema);
export const acessosupdateValidation = zodBodyValidation(acessosUpdateSchema);
