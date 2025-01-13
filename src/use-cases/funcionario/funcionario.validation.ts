import { zodBodyValidation } from '../../helpers/zod-validation';
import { funcionarioCreateSchema, funcionarioUpdateSchema } from './funcionario.dto';

export const createValidation = zodBodyValidation(funcionarioCreateSchema);
export const updateValidation = zodBodyValidation(funcionarioUpdateSchema);
