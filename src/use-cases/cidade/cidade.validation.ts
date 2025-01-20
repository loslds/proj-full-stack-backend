import { zodBodyValidation } from '../../helpers/zod-validation';
import { cidadeCreateSchema, cidadeUpdateSchema } from './cidade.dto';

export const createValidation = zodBodyValidation(cidadeCreateSchema);
export const updateValidation = zodBodyValidation(cidadeUpdateSchema);
