

// C:\repository\proj-full-stack-backend\src\use-cases\fone\fones.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import {
  fonesCreateSchema,
  fonesUpdateSchema
} from './fones.dto';

export const fonescreateValidation = zodBodyValidation(fonesCreateSchema);
export const fonesupdateValidation = zodBodyValidation(fonesUpdateSchema);



