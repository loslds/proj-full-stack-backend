
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { Data_SysEntity } from './data_sys.entity';

export const data_sysCreateSchema = z.object({
  nome: z.string().min(3),
  chkdb: z.number().max(1),
});

export const data_sysUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  chkdb: z.number().max(1),
});

export type Data_SysCreate = z.infer<typeof data_sysCreateSchema>;
export type Data_SysUpdate = z.infer<typeof data_sysUpdateSchema>;
export type Data_SysDto = DeepPartial<Data_SysEntity>

