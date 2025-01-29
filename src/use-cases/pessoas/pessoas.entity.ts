import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('pessoas')

@Index(['nmpessoa', 'sigla']) // Índice composto único para nmpessoa e sigla

export class PessoasEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number; // O campo 'id' será autoincremento

  @Column({ type: 'varchar', length: 45, nullable: false, collation:'utf8mb4_general_ci' })
  nmpessoa: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  sigla: string;

  @Column({ type: 'int', nullable: true, default: null })
  createdBy?: number;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  updatedBy?: number;

  @Column({ type: 'datetime', nullable: true })
  updatedAt?: Date;
}
