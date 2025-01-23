import { zodBodyValidation } from '../../helpers/zod-validation';
import { emailsCreateSchema, emailsUpdateSchema } from './emails.dto';

export const createValidation = zodBodyValidation(emailsCreateSchema);
export const updateValidation = zodBodyValidation(emailsUpdateSchema);
