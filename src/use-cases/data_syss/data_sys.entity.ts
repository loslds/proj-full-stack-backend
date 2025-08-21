
import { Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity('data_sys')
@Unique(['nome']) // Adiciona a restrição de unicidade composta
export class Data_SysEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number; // O campo 'id' será autoincremento

  @Column({ name:'nome', type: 'varchar', length: 60, nullable: false, collation:'utf8mb4_general_ci' })
  nome: string;

  @Column({ type: 'tinyint', nullable: false, default: 0 })
  chkdb: number;

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

