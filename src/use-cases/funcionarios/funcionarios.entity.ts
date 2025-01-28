import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { PessoasEntity } from '../pessoas/pessoas.entity';
import { EmpresasEntity } from '../empresas/empresas.entity';

@Entity('funcionarios')
export class FuncionariosEntity {
  // Campo REGISTRO FUNCIONARIOS
  @Column({ primary: true, generated: true, type: 'int', nullable: false })
  id: number;

  // Relacionamento com a entidade PessoaEntity
  @ManyToOne(() => PessoasEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoasEntity;

  // Campo para armazenar o id_pessoa
  @Column({ type: 'int', nullable: false })
  id_pessoa: number;

  // Relacionamento com a entidade EmpresaEntity
  @ManyToOne(() => EmpresasEntity)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresasEntity;

  // Campo para armazenar o id_empresa
  @Column({ type: 'int', nullable: false })
  id_empresa: number;

  // Campo NOME DO FUNCIONARIO.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  name: string;

  // Campo NOME FANTASIA DO FUNCIONARIOS.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  fantasy: string;

  // Campo para do id usuario na criação do reg.
  @Column({ type: 'int', nullable: true, default: null })
  createdBy?: number;
  // Campo para DATATIME na criação do reg.
  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  // Campo para do id usuario na atualização do reg.
  @Column({ type: 'int', nullable: true })
  updatedBy?: number;
  // Campo para DATATIME na atualizaçaõ do reg.
  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
  })
  updatedAt?: Date;
}
