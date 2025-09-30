// /use-cases/cliente/clientes.validation.ts 

import { zodBodyValidation } from '../../helpers/zod-validation';
import { fornecedoresCreateSchema, fornecedoresUpdateSchema } from './fornecedores.dto';

export const fornecedorescreateValidation = zodBodyValidation(fornecedoresCreateSchema);
export const fornecedoresupdateValidation = zodBodyValidation(fornecedoresUpdateSchema);
