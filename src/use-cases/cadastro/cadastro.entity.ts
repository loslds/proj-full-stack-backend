import { FuncionarioEntity } from './../funcionario/funcionario.entity';
import { ClienteEntity } from './../cliente/cliente.entity';
import { ConsumidorEntity } from './../consumidor/consumidor.entity';
import { FornecedorEntity } from './../fornecedor/fornecedor.entity';
import { EmpresaEntity } from './../empresa/empresa.entity';
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cadastro')
export class CadastroEntity {
  // Campo REGISTRO CADASTRO.
  @PrimaryGeneratedColumn()
  id: number;

  // Relacionamento com a entidade EmpresaEntity
  @ManyToOne(() => EmpresaEntity)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresaEntity;

  @Column({ type: 'int', nullable: true })
  id_empresa: number;

  // Relacionamento com a entidade FornecedorEntity
  @ManyToOne(() => FornecedorEntity)
  @JoinColumn({ name: 'id_fornecedor' })
  fornecedor: FornecedorEntity;

  @Column({ type: 'int', nullable: true })
  id_fornecedor: number;

  // Relacionamento com a entidade ConsumidorEntity
  @ManyToOne(() => ConsumidorEntity)
  @JoinColumn({ name: 'id_consumidor' })
  consumidor: ConsumidorEntity;

  @Column({ type: 'int', nullable: true })
  id_consumidor: number;

  // Relacionamento com a entidade ClienteEntity
  @ManyToOne(() => ClienteEntity)
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClienteEntity;

  @Column({ type: 'int', nullable: true })
  id_cliente: number;

  // Relacionamento com a entidade FuncionarioEntity
  @ManyToOne(() => FuncionarioEntity)
  @JoinColumn({ name: 'id_funcionario' })
  funcionario: FuncionarioEntity;

  @Column({ type: 'int', nullable: true })
  id_funcionario: number;

  // Campo ENDEREÇO DA "ENTIDADE"-> (fornecedor, consumidor, cliente, funcionario).
  @Column({ type: 'varchar', length: 200, default: null })
  endereco: string;

  // Campo COMPLEMENTO DO ENDEREÇO DA "ENTIDADE"-> (fornecedor, consumidor, cliente, funcionario).
  @Column({ type: 'varchar', length: 200, default: null })
  complemento: string;

  // Campo CEP DA ENTIDADE.
  @Column({ type: 'varchar', length: 9, default: null })
  cep: string;

  // Campo BAIRRO DA ENTIDADE.
  @Column({ type: 'varchar', length: 45, default: null })
  bairro: string;

  // Campo CIDADE DA ENTIDADE.
  @Column({ type: 'varchar', length: 60, default: null })
  cidade: string;

  // Campo ESTADO DA ENTIDADE.
  @Column({ type: 'varchar', length: 60, default: null })
  estado: string;

  // Campo UF DA ENTIDADE.
  @Column({ type: 'varchar', length: 5, default: null })
  uf: string;

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
