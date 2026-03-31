
// C:\repository\proj-full-stack-backend\src\use-cases\email\emails.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import {
  emailsCreateSchema,
  emailsUpdateSchema
} from './emails.dto';

export const emailscreateValidation = zodBodyValidation(emailsCreateSchema);
export const emailsupdateValidation = zodBodyValidation(emailsUpdateSchema);


