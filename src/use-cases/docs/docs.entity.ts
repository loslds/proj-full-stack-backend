
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CadastroEntity } from '../cadastros/cadastros.entity';

@Entity('docs')

export class DocsEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // Relacionamento com a entidade CadastroEntity
  @ManyToOne(() => CadastroEntity)
  @JoinColumn({ name: 'id_cadastro' })
  cadastro: CadastroEntity;
  
  @Column({ type: 'int', nullable: false })
  id_cadastro: number;

  ///////////////////////////////////
  
  @Column({ type: 'varchar', length: 20, nullable: true })
  cpf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  inscre: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  inscrm: string;
  
  @Column({ type: 'varchar', length: 20, nullable: true })
  matricula: string;
 
  //////////////////////////////

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
