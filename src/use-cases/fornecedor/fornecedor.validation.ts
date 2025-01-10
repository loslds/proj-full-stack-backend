import { zodBodyValidation } from '../../helpers/zod-validation';
import { fornecedorCreateSchema, fornecedorUpdateSchema } from './fornecedor.dto';

export const createValidation = zodBodyValidation(fornecedorCreateSchema);
export const updateValidation = zodBodyValidation(fornecedorUpdateSchema);
