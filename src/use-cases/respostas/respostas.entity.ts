import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CadastroEntity } from '../cadastros/cadastros.entity';

@Entity('cadastro')
export class RespostasEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  // Relacionamento com a entidade CadastroEntity
  @ManyToOne(() => CadastroEntity)
  @JoinColumn({ name: 'id_cadastro' })
  cadastro: CadastroEntity;

  @Column({ type: 'int', nullable: false })
  id_cadastro: number;

  ///////////////////////////////////

  @Column({ type: 'varchar', length: 100, nullable: true })
  perg1?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  perg2?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  perg3?: string;
  
  @Column({ type: 'varchar', length: 100, nullable: false })
  resp1?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  resp2?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  resp3?: string;
  
  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  updatedBy?: number;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  updatedAt?: Date;
}
