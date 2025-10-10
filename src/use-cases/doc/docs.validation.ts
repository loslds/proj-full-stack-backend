import { zodBodyValidation } from '../../helpers/zod-validation';
import { docsCreateSchema, docsUpdateSchema } from './docs.dto';

export const createValidation = zodBodyValidation(docsCreateSchema);
export const updateValidation = zodBodyValidation(docsUpdateSchema);
