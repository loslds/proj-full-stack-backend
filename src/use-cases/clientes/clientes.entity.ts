
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PessoasEntity } from '../pessoa/pessoa.entity';
import { EmpresasEntity } from '../empresa/empresa.entity';

@Entity('clientes')
export class ClientesEntity {
  // Campo REGISTRO CLIENTE
  @Column({ unique: true, primary: true, generated: true, type: 'int', nullable: false })
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

  // Campo NOME DO CLIENTE.
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  name: string;

  // Campo NOME FANTASIA DO CLIENTE.
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
