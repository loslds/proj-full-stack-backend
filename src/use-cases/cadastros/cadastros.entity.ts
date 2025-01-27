import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PessoasEntity } from '../pessoas/pessoas.entity';
import { EmpresasEntity } from '../empresas/empresas.entity';
import { FornecedorEntity } from '../fornecedor/fornecedor.entity';
import { ConsumidorEntity } from '../consumidor/consumidor.entity';
import { ClientesEntity } from '../clientes/clientes.entity';
import { FuncionarioEntity } from '../funcionario/funcionario.entity';

@Entity('cadastros')
export class CadastrosEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PessoasEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: PessoasEntity;

  @ManyToOne(() => EmpresasEntity)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresasEntity;

  @ManyToOne(() => FornecedorEntity)
  @JoinColumn({ name: 'id_fornecedor' })
  fornecedor: FornecedorEntity;

  @ManyToOne(() => ConsumidorEntity)
  @JoinColumn({ name: 'id_consumidor' })
  consumidor: ConsumidorEntity;

  @ManyToOne(() => ClientesEntity)
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClientesEntity;

  @ManyToOne(() => FuncionarioEntity)
  @JoinColumn({ name: 'id_funcionario' })
  funcionario: FuncionarioEntity;

  
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
