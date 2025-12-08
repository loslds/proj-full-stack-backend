
//C:\repository\proj-full-stack-backend\src\use-cases\empresa\empresas.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique
} from 'typeorm';

import { PessoasEntity } from '../pessoa/pessoas.entity';
@Entity('empresas')
@Unique(['nome', 'fantasy']) // garante que não tenha dois iguais

export class EmpresasEntity {
  @PrimaryGeneratedColumn({ 
    type: 'int', 
    unsigned: true 
  })
  id: number;

   // 🔹 Campo de Relacionamento: FK → pessoas.id
    @Column({ 
    type: 'int', 
    nullable: false,
    unsigned: true
  })
  id_pessoas: number;

  // 🔹 Vinculo de relacionamento de segurança do FK → pessoas.id
  @ManyToOne(() => PessoasEntity, { 
    onDelete: 'RESTRICT', // evita deletar uma pessoa que já está vinculada a empresas
    onUpdate: 'CASCADE'   // atualiza o FK caso o ID da pessoas fosse alterado (é raro, mas seguro)
  })
  @JoinColumn({ 
    name: 'id_pessoas' 
  })
  pessoas: PessoasEntity;

  @Column({ 
    type: 'varchar', 
    length: 120, 
    nullable: false,
    collation: 'utf8mb4_general_ci'
  })
  nome: string;

  @Column({ 
    type: 'varchar', 
    length: 120, 
    nullable: false, 
    collation: 'utf8mb4_general_ci' 
  })
  fantasy: string;

  @Column({ 
    type: 'int', 
    nullable: false, 
    unsigned: true, 
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
    nullable: true, 
    unsigned: true, 
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
