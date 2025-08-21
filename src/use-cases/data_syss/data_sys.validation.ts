import { zodBodyValidation } from '../../helpers/zod-validation';
import { data_sysCreateSchema, data_sysUpdateSchema } from './data_sys.dto';

export const createValidation = zodBodyValidation(data_sysCreateSchema);
export const updateValidation = zodBodyValidation(data_sysUpdateSchema);
