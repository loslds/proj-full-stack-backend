import { zodBodyValidation } from '../../helpers/zod-validation';
import { perguntasCreateSchema, perguntasUpdateSchema } from './perguntas.dto';

export const createValidation = zodBodyValidation(perguntasCreateSchema);
export const updateValidation = zodBodyValidation(perguntasUpdateSchema);
