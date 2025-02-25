import { zodBodyValidation } from '../../helpers/zod-validation';
import { perguntasCreateSchema, perguntasUpdateSchema } from './chaves.dto';

export const createValidation = zodBodyValidation(perguntasCreateSchema);
export const updateValidation = zodBodyValidation(perguntasUpdateSchema);
