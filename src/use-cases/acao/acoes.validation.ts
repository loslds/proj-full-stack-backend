
//C:\repository\proj-full-stack-backend\src\use-cases\acao\acoes.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import { acoesCreateSchema, acoesUpdateSchema } from './acoes.dto';

export const acoescreateValidation = zodBodyValidation(acoesCreateSchema);
export const acoesupdateValidation = zodBodyValidation(acoesUpdateSchema);