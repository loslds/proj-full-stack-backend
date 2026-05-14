
// C:\repository\proj-full-stack-backend\src\use-cases\pergresp\pergsresps.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { pergsrespsCreateSchema, pergsrespsUpdateSchema } from './pergsresps.dto';

export const pergsrespscreateValidation = zodBodyValidation(pergsrespsCreateSchema);
export const pergsrespsupdateValidation = zodBodyValidation(pergsrespsUpdateSchema);