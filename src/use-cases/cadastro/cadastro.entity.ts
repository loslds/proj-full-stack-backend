import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PessoaEntity } from './../pessoa/pessoa.entity';
import { EmpresaEntity } from './../empresa/empresa.entity';
import { FornecedorEntity } from './../fornecedor/fornecedor.entity';
import { ConsumidorEntity } from './../consumidor/consumidor.entity';
import { ClienteEntity } from './../cliente/cliente.entity';
import { FuncionarioEntity } from './../funcionario/funcionario.entity';
import { CidadeEntity } from './../cidade/cidade.entity';
import { EstadoEntity } from './../estado/estado.entity';

@Entity('cadastro')
export class CadastroEntity {
  // Campo REGISTRO CADASTRO.
  @PrimaryGeneratedColumn()
  id: number;

  // Relacionamento com a entidade PessoaEntity
  @ManyToOne(() => PessoaEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoaEntity;

  @Column({ type: 'int', nullable: false })
  id_pessoa: number;

  // Relacionamento com a entidade EmpresaEntity
  @ManyToOne(() => EmpresaEntity)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresaEntity;
  @Column({ type: 'int', nullable: false })
  id_empresa: number;

  // Relacionamento com a entidade FornecedorEntity
  @ManyToOne(() => FornecedorEntity)
  @JoinColumn({ name: 'id_fornecedor' })
  fornecedor: FornecedorEntity;
  @Column({ type: 'int', nullable: false })
  id_fornecedor: number;

  // Relacionamento com a entidade ConsumidorEntity
  @ManyToOne(() => ConsumidorEntity)
  @JoinColumn({ name: 'id_consumidor' })
  consumidor: ConsumidorEntity;
  @Column({ type: 'int', nullable: false })
  id_consumidor: number;

  // Relacionamento com a entidade ClienteEntity
  @ManyToOne(() => ClienteEntity)
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClienteEntity;
  @Column({ type: 'int', nullable: false })
  id_cliente: number;

  // Relacionamento com a entidade FuncionarioEntity
  @ManyToOne(() => FuncionarioEntity)
  @JoinColumn({ name: 'id_funcionario' })
  funcionario: FuncionarioEntity;
  @Column({ type: 'int', nullable: false })
  id_funcionario: number;

  // Relacionamento com a entidade CidadeEntity
  @ManyToOne(() => ConsumidorEntity)
  @JoinColumn({ name: 'id_cidade' })
  cidade: CidadeEntity;
  @Column({ type: 'int', nullable: false })
  id_cidade: number;

  // Relacionamento com a entidade CidadeEntity
  @ManyToOne(() => ConsumidorEntity)
  @JoinColumn({ name: 'id_estado' })
  estado: CidadeEntity;
  @Column({ type: 'int', nullable: false })
  id_estado: number;


  // Campo ENDEREÇO DA "ENTIDADE"-> (fornecedor, consumidor, cliente, funcionario).
  @Column({ type: 'varchar', length: 200, nullable: true })
  endereco: string;

  // Campo COMPLEMENTO DO ENDEREÇO DA "ENTIDADE"-> (fornecedor, consumidor, cliente, funcionario).
  @Column({ type: 'varchar', length: 200, nullable: true })
  complemento: string;

  // Campo CEP DA ENTIDADE.
  @Column({ type: 'varchar', length: 9, nullable: true })
  cep: string;

  // Campo BAIRRO DA ENTIDADE.
  @Column({ type: 'varchar', length: 45, nullable: true })
  bairro: string;

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
