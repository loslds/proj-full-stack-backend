
// C:\repository\proj-full-stack-backend\src\use-cases\login\logins.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { loginsCreateSchema, loginsUpdateSchema } from './logins.dto';

export const loginscreateValidation = zodBodyValidation(loginsCreateSchema);
export const loginsupdateValidation = zodBodyValidation(loginsUpdateSchema);

