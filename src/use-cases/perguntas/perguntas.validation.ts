
//C:\repository\proj-full-stack-backend\src\use-cases\perguntas\perguntas.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import { perguntasCreateSchema, perguntasUpdateSchema } from './perguntas.dto';

export const perguntascreateValidation = zodBodyValidation(perguntasCreateSchema);
export const perguntasupdateValidation = zodBodyValidation(perguntasUpdateSchema);

