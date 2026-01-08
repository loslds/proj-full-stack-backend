import { zodBodyValidation } from '../../helpers/zod-validation';
import { setoresCreateSchema, setoresUpdateSchema } from './setores.dto';

export const createValidation = zodBodyValidation(setoresCreateSchema);
export const updateValidation = zodBodyValidation(setoresUpdateSchema);
