import { zodBodyValidation } from '../../helpers/zod-validation';
import { respostasCreateSchema, respostasUpdateSchema } from './respostas.dto';

export const createValidation = zodBodyValidation(respostasCreateSchema);
export const updateValidation = zodBodyValidation(respostasUpdateSchema);
