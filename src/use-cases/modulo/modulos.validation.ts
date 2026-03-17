
//C:\repository\proj-full-stack-backend\src\use-cases\modulo\modulos.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { modulosCreateSchema, modulosUpdateSchema } from './modulos.dto';

export const modulosCreateValidation = zodBodyValidation(modulosCreateSchema);
export const modulosUpdateValidation = zodBodyValidation(modulosUpdateSchema);

