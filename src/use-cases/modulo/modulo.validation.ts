import { zodBodyValidation } from '../../helpers/zod-validation';
import { moduloCreateSchema, moduloUpdateSchema } from './modulo.dto';

export const createValidation = zodBodyValidation(moduloCreateSchema);
export const updateValidation = zodBodyValidation(moduloUpdateSchema);
