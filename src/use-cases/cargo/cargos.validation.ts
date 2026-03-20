
//C:\repository\proj-full-stack-backend\src\use-cases\cargo\cargos.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import { cargosCreateSchema, cargosUpdateSchema } from './cargos.dto';

export const cargoscreateValidation = zodBodyValidation(cargosCreateSchema);
export const cargosupdateValidation = zodBodyValidation(cargosUpdateSchema);