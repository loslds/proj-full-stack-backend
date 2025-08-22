
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PessoasEntity } from '../pessoa/pessoa.entity';
import { EmpresasEntity } from '../empresa/empresa.entity';
import { FornecedoresEntity } from '../fornecedores/fornecedores.entity';
import { ConsumidoresEntity } from '../consumidores/consumidores.entity';
import { ClientesEntity } from '../clientes/clientes.entity';
import { FuncionariosEntity } from '../funcionarios/funcionarios.entity';
import { UsersEntity } from '../users/users.entity';

@Entity('cadastros')
export class CadastrosEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PessoasEntity)
  @JoinColumn({ name: 'id_pessoa' })
  pessoas: PessoasEntity;

  @ManyToOne(() => EmpresasEntity)
  @JoinColumn({ name: 'id_empresa' })
  empresas: EmpresasEntity;

  @ManyToOne(() => FornecedoresEntity)
  @JoinColumn({ name: 'id_fornecedor' })
  fornecedores: FornecedoresEntity;

  @ManyToOne(() => ConsumidoresEntity)
  @JoinColumn({ name: 'id_consumidor' })
  consumidores: ConsumidoresEntity;

  @ManyToOne(() => ClientesEntity)
  @JoinColumn({ name: 'id_cliente' })
  clientes: ClientesEntity;

  @ManyToOne(() => FuncionariosEntity)
  @JoinColumn({ name: 'id_funcionario' })
  funcionarios: FuncionariosEntity;

  @OneToMany('UsersEntity', (entity: UsersEntity) => entity.cadastro)
  usuarios: UsersEntity[];

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
