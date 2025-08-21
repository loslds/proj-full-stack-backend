import { zodBodyValidation } from '../../helpers/zod-validation';
import { pessoasCreateSchema, pessoasUpdateSchema } from './data_sys.dto';

export const createValidation = zodBodyValidation(pessoasCreateSchema);
export const updateValidation = zodBodyValidation(pessoasUpdateSchema);
