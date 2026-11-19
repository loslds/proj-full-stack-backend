// C:\repository\proj-full-stack-backend\src\use-cases\arquivado\arquivados.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index
} from 'typeorm';

@Entity('arquivados')
@Index('idx_arquivados_origem', ['tab_origem', 'id_origem'])
@Index('idx_arquivados_destino', ['tab_destino', 'id_destino'])
@Index('idx_arquivados_id_users', ['id_users'])
export class ArquivadosEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  tab_origem: string;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_origem: number;

  @Column({
    type: 'datetime',
    nullable: true
  })
  dataorigem: Date | null;

  // 0 = exclusão (arquivado sem destino)
  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_destino: number;

  // vazio = exclusão (arquivado sem destino)
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    default: '',
    collation: 'utf8mb4_general_ci'
  })
  tab_destino: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    default: '',
    collation: 'utf8mb4_general_ci'
  })
  motivo: string;

  // Sem FK de propósito: o histórico não depende de o users continuar
  // existindo. nomeusers guarda o nome como texto histórico.
  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  id_users: number;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
    default: '',
    collation: 'utf8mb4_general_ci'
  })
  nomeusers: string;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  createdBy: number;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: Date;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: true,
    default: 0
  })
  updatedBy: number;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;
}
