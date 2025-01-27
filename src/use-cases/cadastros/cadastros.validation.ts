import { zodBodyValidation } from '../../helpers/zod-validation';
import { cadastrosCreateSchema, cadastrosUpdateSchema } from './cadastro.dto';

export const createValidation = zodBodyValidation(cadastrosCreateSchema);
export const updateValidation = zodBodyValidation(cadastrosUpdateSchema);
