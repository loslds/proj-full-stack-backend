
// /use-cases/pessoa/pessoas.validation.ts 
import { zodBodyValidation } from '../../helpers/zod-validation';
import { pessoasCreateSchema, pessoasUpdateSchema } from './pessoas.dto';

export const pessoascreateValidation = zodBodyValidation(pessoasCreateSchema);
export const pessoasupdateValidation = zodBodyValidation(pessoasUpdateSchema);

