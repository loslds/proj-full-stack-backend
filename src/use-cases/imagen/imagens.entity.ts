
//C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.entity.ts
import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  Unique, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity('imagens')
@Unique(['arqNome', 'arqTipo']) // garante que não tenha dois iguais
export class ImagensEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // se é logo, avatar, ou outro tipo no futuro
  @Column({ type: 'enum', enum: ['logo', 'avatar'], nullable: false })
  arqTipo: 'logo' | 'avatar';

  // nome do arquivo original ou referência
  @Column({ type: 'varchar', length: 150, nullable: false, collation: 'utf8mb4_general_ci' })
  arqNome: string;

  // caminho onde o arquivo foi salvo no terminal/servidor
  @Column({ type: 'varchar', length: 255, nullable: false, collation: 'utf8mb4_general_ci' })
  arqPath: string;

  // blob opcional (caso você queira armazenar diretamente no banco)
  @Column({ type: 'longblob', nullable: true })
  arqBlob?: Buffer | string | null;
  
  // quem criou
  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  createBy: number;

  @CreateDateColumn({ type: 'datetime' })
  createAt: Date;

  // quem alterou
  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  updateBy: number;

  @UpdateDateColumn({ type: 'datetime' })
  updateAt: Date;
}
