//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.entity.ts

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

import { PessoasEntity } from '../pessoa/pessoas.entity';
import { ImagensEntity } from '../imagen/imagens.entity';

@Entity('consumidores')
@Unique(['nome']) // garante que não tenha dois iguais

export class ConsumidoresEntity {
  
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

   // 🔹 Campo para armazenar o id da tabela
  @Column({ type: 'int', nullable: false })
  id_pessoas: number;
  // 🔹 Relacionamento com Pessoas
  @ManyToOne(() => PessoasEntity)
  @JoinColumn({ name: 'id_pessoas' })
  pessoas: PessoasEntity;

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
