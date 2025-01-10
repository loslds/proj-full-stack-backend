import { zodBodyValidation } from '../../helpers/zod-validation';
import { empresaCreateSchema, empresaUpdateSchema } from './empresa.dto';

export const createValidation = zodBodyValidation(empresaCreateSchema);
export const updateValidation = zodBodyValidation(empresaUpdateSchema);
