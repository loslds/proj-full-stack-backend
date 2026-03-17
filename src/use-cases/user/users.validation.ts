import { zodBodyValidation } from '../../helpers/zod-validation';
import { usersCreateSchema, usersUpdateSchema } from './users.dto';

export const createValidation = zodBodyValidation(usersCreateSchema);
export const updateValidation = zodBodyValidation(usersUpdateSchema);
