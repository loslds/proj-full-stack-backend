
// C:\repository\proj-full-stack-backend\src\use-cases\servicos\servicos.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { servicosCreateSchema, servicosUpdateSchema } from './servicos.dto';

export const servicoscreateValidation = zodBodyValidation(servicosCreateSchema);
export const servicosupdateValidation = zodBodyValidation(servicosUpdateSchema);


