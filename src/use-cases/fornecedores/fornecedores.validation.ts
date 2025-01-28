import { zodBodyValidation } from '../../helpers/zod-validation';
import { fornecedoresCreateSchema, fornecedoresUpdateSchema } from './fornecedores.dto';

export const createValidation = zodBodyValidation(fornecedoresCreateSchema);
export const updateValidation = zodBodyValidation(fornecedoresUpdateSchema);
