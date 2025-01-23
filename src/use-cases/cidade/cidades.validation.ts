import { zodBodyValidation } from '../../helpers/zod-validation';
import { cidadesCreateSchema, cidadesUpdateSchema } from './cidades.dto';

export const createValidation = zodBodyValidation(cidadesCreateSchema);
export const updateValidation = zodBodyValidation(cidadesUpdateSchema);
