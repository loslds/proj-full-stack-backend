
// /use-cases/pessoa/empresas.validation.ts 
import { zodBodyValidation } from '../../helpers/zod-validation';
import { empresasCreateSchema, empresasUpdateSchema } from './empresas.dto';

export const createValidation = zodBodyValidation(empresasCreateSchema);
export const updateValidation = zodBodyValidation(empresasUpdateSchema);
