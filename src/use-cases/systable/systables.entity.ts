
//C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity('systables')
@Unique(['nome']) // Adiciona a restrição de unicidade composta

export class SystablesEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 60, nullable: false, collation: 'utf8mb4_general_ci' })
  nome: string;
  
  @Column({ type: 'tinyint', nullable: false, unsigned: true, default: 0 })
  chkdb: number;

  @Column({ type: 'tinyint', nullable: false, unsigned: true, default: 0 })
  numberregs: number;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  createBy: number;

  @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  updateBy: number;

  @Column({ type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' })
  updateAt: Date;
}


