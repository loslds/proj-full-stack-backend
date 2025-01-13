import { zodBodyValidation } from '../../helpers/zod-validation';
import { consumidorCreateSchema, consumidorUpdateSchema } from './consumidor.dto';

export const createValidation = zodBodyValidation(consumidorCreateSchema);
export const updateValidation = zodBodyValidation(consumidorUpdateSchema);
