
//
// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import { visitasCreateSchema, visitasUpdateSchema } from './visitas.dto';

export const visitascreateValidation = zodBodyValidation(visitasCreateSchema);
export const visitasupdateValidation = zodBodyValidation(visitasUpdateSchema);