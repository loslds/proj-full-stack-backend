
// C:\repository\proj-full-stack-backend\src\use-cases\doc\docs.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { docsCreateSchema, docsUpdateSchema } from './docs.dto';

export const docscreateValidation = zodBodyValidation(docsCreateSchema);
export const docsupdateValidation = zodBodyValidation(docsUpdateSchema);

