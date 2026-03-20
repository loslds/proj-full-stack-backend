

// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.dto.ts
// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.dto.ts
import { DeepPartial } from 'typeorm';
import { z } from 'zod';
import { VisitasEntity } from './visitas.entity';

export const visitasCreateSchema = z.object({
  id_visitantes: z.number().int().positive(),
  tempo_visita: z.number().int().nonnegative().optional(),
  saidaAt: z.coerce.date().optional(),
  createdBy: z.number().int().nonnegative().optional(),
  updatedBy: z.number().int().nonnegative().optional()
});

export const visitasUpdateSchema = visitasCreateSchema.partial().extend({
  id: z.number().int().positive().optional()
});

export type VisitasCreate = z.infer<typeof visitasCreateSchema>;
export type VisitasUpdate = z.infer<typeof visitasUpdateSchema>;
export type VisitasDto = DeepPartial<VisitasEntity>;



