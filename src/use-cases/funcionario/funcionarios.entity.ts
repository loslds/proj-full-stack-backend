//C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique
} from 'typeorm';

import { EmpresasEntity } from '../empresa/empresas.entity';
import { ImagensEntity } from '../imagen/imagens.entity';

@Entity('funcionarios')
@Unique(['nome']) // garante que não tenha dois iguais

export class FuncionariosEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

   // 🔹 Campo para armazenar o id da empresa
  @Column({ type: 'int', nullable: false })
  id_empresas: number;
  // 🔹 Relacionamento com Pessoas
  @ManyToOne(() => EmpresasEntity)
  @JoinColumn({ name: 'id_empresas' })
  empresas: EmpresasEntity;

  // 🔹 Campo para armazenar o id da imagem
  @Column({ type: 'int', nullable: false })
  id_imagens: number;

  // 🔹 Relacionamento com Imagens
  @ManyToOne(() => ImagensEntity)
  @JoinColumn({ name: 'id_imagens' })
  imagens: ImagensEntity;

  @Column({ type: 'varchar', length: 60, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  fantasy: string;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
  createdBy?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'int', nullable: true, unsigned: true, default: null })
  updatedBy?: number;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
