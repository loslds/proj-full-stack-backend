import { zodBodyValidation } from '../../helpers/zod-validation';
import { systableCreateSchema, systableUpdateSchema } from './systable.dto';

export const createValidation = zodBodyValidation(systableCreateSchema);
export const updateValidation = zodBodyValidation(systableUpdateSchema);
