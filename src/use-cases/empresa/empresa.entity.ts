
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { PessoaEntity } from '../pessoa/pessoa.entity';

@Entity('empresa')
export class EmpresaEntity {
  // Campo REGISTRO empresa.
  @Column({ primary: true, generated: true, type: 'int', nullable: false })
  id: number;
  
  // Campo para armazenar o id_pessoa a ser usado em filtro em empresas de mesma caracteristica de pessoa.
  @Column({ type: 'int', nullable: false })
  id_pessoa: number;

  // Campo NOME DA EMPRESA.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  name: string;

  // Campo NOME FANTASIA DA EMPRESA.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  fantasy: string;
  
  // Campo para armazenar o logotipo da empresa como um blob ou buffer
  @Column({ type: 'blob', nullable: false })
  logo?: Buffer;

  // Campo para o nome do arquivo do logotipo
  @Column({ type: 'varchar', length: 200, nullable: false })
  name_arq_logo?: string;

  // Campo para o caminho do arquivo do logotipo
  @Column({ type: 'varchar', length: 200, nullable: false })
  path_arq_logo?: string;

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

  @ManyToOne(() => PessoaEntity)
  @JoinColumn({ name: 'id_pessoa' })
  idPessoa: PessoaEntity;
}

