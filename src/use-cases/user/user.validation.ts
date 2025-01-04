import { zodBodyValidation } from '../../helpers/zod-validation';
import { userCreateSchema, userUpdateSchema } from './user.dto';

export const createValidation = zodBodyValidation(userCreateSchema);
export const updateValidation = zodBodyValidation(userUpdateSchema);
