
//C:\repository\proj-full-stack-backend\src\use-cases\visitante\visitantes.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import {
  visitantesCreateSchema,
  visitantesUpdateSchema
} from './visitantes.dto';

export const visitantescreateValidation = zodBodyValidation(visitantesCreateSchema);
export const visitantesupdateValidation = zodBodyValidation(visitantesUpdateSchema);