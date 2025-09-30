
// /use-cases/pessoa/empresas.validation.ts 
import { zodBodyValidation } from '../../helpers/zod-validation';
import { funcionariosCreateSchema, funcionariosUpdateSchema } from './funcionarios.dto';

export const funcionarioscreateValidation = zodBodyValidation(funcionariosCreateSchema);
export const funcionariosupdateValidation = zodBodyValidation(funcionariosUpdateSchema);
