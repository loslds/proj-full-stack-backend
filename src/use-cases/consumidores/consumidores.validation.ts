import { zodBodyValidation } from '../../helpers/zod-validation';
import { consumidoresCreateSchema, consumidoresUpdateSchema } from './consumidores.dto';

export const createValidation = zodBodyValidation(consumidoresCreateSchema);
export const updateValidation = zodBodyValidation(consumidoresUpdateSchema);
