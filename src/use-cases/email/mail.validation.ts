import { zodBodyValidation } from '../../helpers/zod-validation';
import { emailCreateSchema, emailUpdateSchema } from './email.dto';

export const createValidation = zodBodyValidation(emailCreateSchema);
export const updateValidation = zodBodyValidation(emailUpdateSchema);
