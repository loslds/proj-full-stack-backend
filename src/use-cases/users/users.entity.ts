
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CadastroEntity } from '../cadastros/cadastros.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // Relacionamento com a entidade CadastroEntity
  @ManyToOne(() => CadastroEntity)
  @JoinColumn({ name: 'id_cadastro' })
  cadastro: CadastroEntity;

  @Column({ type: 'int', nullable: false })
  id_cadastro: number;

  // Define se o usuário está bloqueado 
  @Column({ type: 'int', nullable: false, default: 0 })
  bloqueado: number;

  // Contagem de acessos
  @Column({ type: 'int', nullable: false })
  qdd_acesso: number;

  // Último acesso (como data e hora)
  @Column({ 
    type: 'timestamp',
    precision: null,
    nullable: false,
  })
  ult_acesso: Date;

  // Data e hora do login
  @Column({ 
    type: 'timestamp',
    precision: null,
    nullable: false,
  })
  data_login: Date;

  // Data e hora do logout
  @Column({ type: 'timestamp', nullable: false })
  data_logout: Date;

  // Data e hora de criação do registro
  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // Usuário que realizou a última atualização
  @Column({ type: 'int', nullable: true })
  updatedBy?: number;

  // Data e hora da última atualização
  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
  })
  updatedAt?: Date;
}
