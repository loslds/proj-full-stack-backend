import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { PessoaEntity } from '../pessoa/pessoa.entity';
import { EmpresaEntity } from '../empresa/empresa.entity';

@Entity('funcionario')
export class FuncionarioEntity {
  // Campo REGISTRO FUNCIONARIO
  @Column({ primary: true, generated: true, type: 'int', nullable: false })
  id: number;

  // Relacionamento com a entidade PessoaEntity
  @ManyToOne(() => PessoaEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoaEntity;

  // Campo para armazenar o id_pessoa
  @Column({ type: 'int', nullable: false })
  id_pessoa: number;

  // Relacionamento com a entidade EmpresaEntity
  @ManyToOne(() => EmpresaEntity)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresaEntity;

  // Campo para armazenar o id_empresa
  @Column({ type: 'int', nullable: false })
  id_empresa: number;

  // Campo NOME DO FUNCIONARIO.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  name: string;

  // Campo NOME FANTASIA DO FUNCIONARIO.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  fantasy: string;

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
