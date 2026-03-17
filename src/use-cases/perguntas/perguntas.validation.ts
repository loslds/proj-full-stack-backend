
//C:\repository\proj-full-stack-backend\src\use-cases\perguntas\perguntas.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import { perguntasCreateSchema, perguntasUpdateSchema } from './perguntas.dto';

export const perguntasCreateValidation = zodBodyValidation(perguntasCreateSchema);
export const perguntasUpdateValidation = zodBodyValidation(perguntasUpdateSchema);