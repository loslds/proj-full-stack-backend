import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
//import { PessoaEntity } from '../pessoa/pessoa.entity';

@Entity('cadastro')
export class CadastroEntity {
  // Campo REGISTRO cadastro.
  @Column({ primary: true, generated: true, type: 'int', nullable: false })
  id: number;
  
  // Campo para armazenar o id_empresa a ser usado em filtro em cadastro de mesma  caracteristica de empresa.
  @Column({ type: 'int', nullable: true })
  id_empresa: number;

  // Campo para armazenar o id_fornecedor a ser usado em filtro em cadastro de mesma  caracteristica de fornecedor.
  @Column({ type: 'int', nullable: true })
  id_fornecedor: number;

  // Campo para armazenar o id_consumidor a ser usado em filtro em cadastro de mesma  caracteristica de consumidor.
  @Column({ type: 'int', nullable: true })
  id_consumidor: number;

  // Campo para armazenar o id_cliente a ser usado em filtro em cadastro de mesma  caracteristica de cliente.
  @Column({ type: 'int', nullable: true })
  id_cliente: number;

  // Campo para armazenar o id_funcionario a ser usado em filtro em cadastro de mesma  caracteristica de funcionario.
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

  // Campo CIDADE DA ENTIDADE.
  @Column({ type: 'varchar', length: 5, default: null })
  uf: string;
  
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

  @Index()
  @Column({ type: 'int', nullable: true })
  empresa_id: number;
}
