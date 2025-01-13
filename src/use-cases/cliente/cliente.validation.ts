import { zodBodyValidation } from '../../helpers/zod-validation';
import { clienteCreateSchema, clienteUpdateSchema } from './cliente.dto';

export const createValidation = zodBodyValidation(clienteCreateSchema);
export const updateValidation = zodBodyValidation(clienteUpdateSchema);
