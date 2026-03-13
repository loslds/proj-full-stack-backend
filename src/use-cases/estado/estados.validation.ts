// C:\repository\proj-full-stack-backend\src\use-cases\estado\estados.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { estadosCreateSchema, estadosUpdateSchema } from './estados.dto';

export const estadosCreateValidation = zodBodyValidation(estadosCreateSchema);
export const estadosUpdateValidation = zodBodyValidation(estadosUpdateSchema);