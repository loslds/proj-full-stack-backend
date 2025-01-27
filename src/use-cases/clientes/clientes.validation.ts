import { zodBodyValidation } from '../../helpers/zod-validation';
import { clientesCreateSchema, clientesUpdateSchema } from './clientes.dto';

export const createValidation = zodBodyValidation(clientesCreateSchema);
export const updateValidation = zodBodyValidation(clientesUpdateSchema);
