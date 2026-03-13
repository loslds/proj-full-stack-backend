// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { cidadesCreateSchema, cidadesUpdateSchema } from './cidades.dto';

export const cidadesCreateValidation = zodBodyValidation(cidadesCreateSchema);
export const cidadesUpdateValidation = zodBodyValidation(cidadesUpdateSchema);