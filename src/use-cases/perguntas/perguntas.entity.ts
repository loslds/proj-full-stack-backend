
//C:\repository\proj-full-stack-backend\src\use-cases\pergunta\perguntas.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('perguntas')
@Unique(['nome'])
export class PerguntasEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  nome: string;

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

