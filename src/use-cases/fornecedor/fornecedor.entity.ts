import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { PessoaEntity } from '../pessoa/pessoa.entity';
import { EmpresaEntity } from '../empresa/empresa.entity';

@Entity('fornecedor')
export class FornecedorEntity {
  // Campo REGISTRO fornecedor.
  @Column({ primary: true, generated: true, type: 'int', nullable: false })
  id: number;

  // Campo NOME DO FORNECEDOR.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  name: string;

  // Campo NOME FANTASIA DO FORNECEDOR.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  fantasy: string;

  // Campo para armazenar o id_pessoa a ser usado em filtro em cadastro de mesma pessoa.
  @Column({ type: 'int', nullable: true })
  id_pessoa: number;

  // Relacionamento com a entidade PessoaEntity
  @ManyToOne(() => PessoaEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoaEntity;

  // Campo para armazenar o id_empresa a ser usado em filtro em cadastro de mesma empresa.
  @Column({ type: 'int', nullable: true })
  id_empresa: number;
  
  // Relacionamento com a entidade EmpresaEntity
  @ManyToOne(() => EmpresaEntity)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresaEntity;

  // Campo para o caminho do arquivo do logotipo
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

