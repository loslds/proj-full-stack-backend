
//C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import { imagensCreateSchema, imagensUpdateSchema } from './imagens.dto';

export const imagenscreateValidation = zodBodyValidation(imagensCreateSchema);
export const imagensupdateValidation = zodBodyValidation(imagensUpdateSchema);
