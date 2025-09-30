import { zodBodyValidation } from '../../helpers/zod-validation';
import { cadastrosCreateSchema, cadastrosUpdateSchema } from './cadastros.dto';

export const createValidation = zodBodyValidation(cadastrosCreateSchema);
export const updateValidation = zodBodyValidation(cadastrosUpdateSchema);
