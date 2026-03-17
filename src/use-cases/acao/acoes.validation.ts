
//C:\repository\proj-full-stack-backend\src\use-cases\acao\acoes.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import { acoesCreateSchema, acoesUpdateSchema } from './acoes.dto';

export const acoesCreateValidation = zodBodyValidation(acoesCreateSchema);
export const acoesUpdateValidation = zodBodyValidation(acoesUpdateSchema);