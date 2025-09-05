
//C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity('systables')
@Unique(['nome']) // Adiciona a restrição de unicidade composta

export class SystablesEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number; // O campo 'id' será autoincremento

  @Column({ name:'nome', type: 'varchar', length: 60, nullable: false, collation:'utf8mb4_general_ci' })
  nome: string;

  @Column({ type: 'tinyint', nullable: false, unsigned: true, default: 0 })
  chkdb: number;

  @Column({ type: 'int', nullable: true, unsigned: true, default: 0 })
  numberregs?: number;

  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  updatedBy?: number;

  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
    default: () => 'CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;
}

