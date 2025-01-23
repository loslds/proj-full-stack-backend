import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PessoaEntity } from './../pessoa/pessoa.entity';
import { EmpresaEntity } from './../empresa/empresa.entity';
import { FornecedorEntity } from './../fornecedor/fornecedor.entity';
import { ConsumidorEntity } from './../consumidor/consumidor.entity';
import { ClienteEntity } from './../cliente/cliente.entity';
import { FuncionarioEntity } from './../funcionario/funcionario.entity';
import { CidadesEntity } from '../cidade/cidades.entity';
import { RespostasEntity } from '../respostas/respostas.entity';

@Entity('cadastro')
export class CadastroEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PessoaEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoaEntity;

  @ManyToOne(() => EmpresaEntity)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresaEntity;

  @ManyToOne(() => FornecedorEntity)
  @JoinColumn({ name: 'id_fornecedor' })
  fornecedor: FornecedorEntity;

  @ManyToOne(() => ConsumidorEntity)
  @JoinColumn({ name: 'id_consumidor' })
  consumidor: ConsumidorEntity;

  @ManyToOne(() => ClienteEntity)
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClienteEntity;

  @ManyToOne(() => FuncionarioEntity)
  @JoinColumn({ name: 'id_funcionario' })
  funcionario: FuncionarioEntity;

  @ManyToOne(() => CidadesEntity)
  @JoinColumn({ name: 'id_cidade' })
  cidades: CidadesEntity;

  @ManyToOne(() => RespostasEntity)
  @JoinColumn({ name: 'id_respostas' })
  respostas: RespostasEntity;

  @Column({ type: 'varchar', length: 200, nullable: true })
  endereco?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  complemento?: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  cep?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  bairro?: string;

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
