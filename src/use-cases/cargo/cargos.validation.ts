
//C:\repository\proj-full-stack-backend\src\use-cases\cargo\cargos.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import { cargosCreateSchema, cargosUpdateSchema } from './cargos.dto';

export const cargosCreateValidation = zodBodyValidation(cargosCreateSchema);
export const cargosUpdateValidation = zodBodyValidation(cargosUpdateSchema);