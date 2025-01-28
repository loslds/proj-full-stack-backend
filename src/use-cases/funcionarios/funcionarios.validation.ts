import { zodBodyValidation } from '../../helpers/zod-validation';
import { funcionariosCreateSchema, funcionariosUpdateSchema } from './funcionarios.dto';

export const createValidation = zodBodyValidation(funcionariosCreateSchema);
export const updateValidation = zodBodyValidation(funcionariosUpdateSchema);
