
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PessoaEntity } from '../pessoa/pessoa.entity';

@Entity('empresa')
@Unique(['name', 'fantasy', 'id_pessoa']) // Adiciona a restrição de unicidade composta
export class EmpresaEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // Relacionamento com a entidade PessoaEntity
  @ManyToOne(() => PessoaEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoaEntity;
  
  @Column({ type: 'int', nullable: false })
  id_pessoa: number;

  ///////////////////////////////////
  
  @Column({ type: 'varchar', length: 45, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
  fantasy: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  arqlogo?: string;

  @Column({ type: 'blob', nullable: true })
  imagelogo?: Buffer;

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
  })
  updatedAt?: Date;

}
