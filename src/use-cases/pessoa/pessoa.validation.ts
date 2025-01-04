import { zodBodyValidation } from '../../helpers/zod-validation';
import { pessoaCreateSchema, pessoaUpdateSchema } from './pessoa.dto';

export const createValidation = zodBodyValidation(pessoaCreateSchema);
export const updateValidation = zodBodyValidation(pessoaUpdateSchema);
