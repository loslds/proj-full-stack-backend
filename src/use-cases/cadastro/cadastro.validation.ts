import { zodBodyValidation } from '../../helpers/zod-validation';
import { cadastroCreateSchema, cadastroUpdateSchema } from './cadastro.dto';

export const createValidation = zodBodyValidation(cadastroCreateSchema);
export const updateValidation = zodBodyValidation(cadastroUpdateSchema);
