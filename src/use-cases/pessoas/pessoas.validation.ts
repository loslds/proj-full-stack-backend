import { zodBodyValidation } from '../../helpers/zod-validation';
import { pessoasCreateSchema, pessoasUpdateSchema } from './pessoas.dto';

export const createValidation = zodBodyValidation(pessoasCreateSchema);
export const updateValidation = zodBodyValidation(pessoasUpdateSchema);
