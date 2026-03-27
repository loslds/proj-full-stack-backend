
// C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { empresasCreateSchema, empresasUpdateSchema } from './empresas.dto';

export const empresascreateValidation = zodBodyValidation(empresasCreateSchema);
export const empresasupdateValidation = zodBodyValidation(empresasUpdateSchema);


