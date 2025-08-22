import { zodBodyValidation } from '../../helpers/zod-validation';
import { empresasCreateSchema, empresasUpdateSchema } from './empresa.dto';

export const createValidation = zodBodyValidation(empresasCreateSchema);
export const updateValidation = zodBodyValidation(empresasUpdateSchema);
