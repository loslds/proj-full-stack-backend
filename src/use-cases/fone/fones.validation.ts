import { zodBodyValidation } from '../../helpers/zod-validation';
import { fonesCreateSchema, fonesUpdateSchema } from './fones.dto';

export const createValidation = zodBodyValidation(fonesCreateSchema);
export const updateValidation = zodBodyValidation(fonesUpdateSchema);
