import { zodBodyValidation } from '../../helpers/zod-validation';
import { codsegsCreateSchema, codsegsUpdateSchema } from './codsegs.dto';

export const createValidation = zodBodyValidation(codsegsCreateSchema);
export const updateValidation = zodBodyValidation(codsegsUpdateSchema);
