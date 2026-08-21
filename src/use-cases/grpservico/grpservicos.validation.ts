
// C:\repository\proj-full-stack-backend\src\use-cases\grpservico\grpservicos.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';

import {
  grpservicosCreateSchema,
  grpservicosUpdateSchema
} from './grpservicos.dto';


export const grpservicoscreateValidation =
  zodBodyValidation(grpservicosCreateSchema);


export const grpservicosupdateValidation =
  zodBodyValidation(grpservicosUpdateSchema);