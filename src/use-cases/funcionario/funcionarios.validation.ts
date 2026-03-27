
// C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.validation.ts

import { zodBodyValidation } from '../../helpers/zod-validation';
import { funcionariosCreateSchema, funcionariosUpdateSchema} from './funcionarios.dto';

export const funcionarioscreateValidation = zodBodyValidation(funcionariosCreateSchema);
export const funcionariosupdateValidation = zodBodyValidation(funcionariosUpdateSchema);


