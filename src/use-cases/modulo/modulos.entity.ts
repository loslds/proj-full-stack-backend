
// C:\repository\proj-full-stack-backend\src\use-cases\modulo\modulos.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique
} from 'typeorm';

@Entity('modulos')
@Unique(['name'])
export class ModulosEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number;

  /**
   * Nome do módulo do sistema:
   * visitante 
   * recepcao 
   * design 
   * producao 
   * acabamento 
   * expedicao 
   * adminisracao 
   * config
   */
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  name: string;

  /**
   * Usuário que criou o registro
   */
  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  createdBy: number;

  /**
   * Data de criação
   */
  @CreateDateColumn({
    type: 'datetime'
  })
  createdAt: Date;

  /**
   * Usuário que atualizou
   */
  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  updatedBy: number;

  /**
   * Data da última atualização
   */
  @UpdateDateColumn({
    type: 'datetime'
  })
  updatedAt: Date;
}

