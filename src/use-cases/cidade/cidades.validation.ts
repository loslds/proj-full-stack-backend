import { zodBodyValidation } from '../../helpers/zod-validation';
import { cidadesCreateSchema, cidadesUpdateSchema } from './cidades.dto';

export const cidadescreateValidation = zodBodyValidation(cidadesCreateSchema);
export const cidadesupdateValidation = zodBodyValidation(cidadesUpdateSchema);
