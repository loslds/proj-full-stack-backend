

// C:\repository\proj-full-stack-backend\src\use-cases\fornecedor\fornecedores.validation.ts
import { zodBodyValidation } from '../../helpers/zod-validation';
import {
  fornecedoresCreateSchema,
  fornecedoresUpdateSchema
} from './fornecedores.dto';

export const fornecedorescreateValidation = zodBodyValidation(fornecedoresCreateSchema);
export const fornecedoresupdateValidation = zodBodyValidation(fornecedoresUpdateSchema);