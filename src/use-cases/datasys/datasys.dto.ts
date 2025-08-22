
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { DataSysEntity } from './datasys.entity';

export const data_sysCreateSchema = z.object({
  nome: z.string().min(3),
  chkdb: z.number().max(1),
});

export const data_sysUpdateSchema = z.object({
  nome: z.string().min(3).optional(),
  chkdb: z.number().max(1),
});

export type DataSysCreate = z.infer<typeof data_sysCreateSchema>;
export type DataSysUpdate = z.infer<typeof data_sysUpdateSchema>;
export type DataSysDto = DeepPartial<DataSysEntity>

