
// /use-cases/pessoa/systables.validation.ts 
import { zodBodyValidation } from '../../helpers/zod-validation';
import { systablesCreateSchema, systablesUpdateSchema } from './systables.dto';

export const createValidation = zodBodyValidation(systablesCreateSchema);
export const updateValidation = zodBodyValidation(systablesUpdateSchema);
