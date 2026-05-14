 
// C:\repository\proj-full-stack-backend\src\use-cases\users\users.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { usersCreateSchema, usersUpdateSchema } from './users.dto';

export const userscreateValidation = zodBodyValidation(usersCreateSchema);
export const usersupdateValidation = zodBodyValidation(usersUpdateSchema);

