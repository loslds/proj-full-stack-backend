
import { Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity('pessoas')
@Unique(['nmpessoa']) // Adiciona a restrição de unicidade composta
export class PessoasEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number; // O campo 'id' será autoincremento

  @Column({ name:'nmpessoa', type: 'varchar', length: 45, nullable: false, collation:'utf8mb4_general_ci' })
  nmpessoa: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  sigla: string;

  @Column({ type: 'int', nullable: true, default: null })
  createdBy?: number;

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

