// C:\repository\proj-full-stack-backend\src\use-cases\arquivado\arquivados.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { arquivadosCreateSchema, arquivadosUpdateSchema } from './arquivados.dto';

export const arquivadoscreateValidation = zodBodyValidation(arquivadosCreateSchema);
export const arquivadosupdateValidation = zodBodyValidation(arquivadosUpdateSchema);
