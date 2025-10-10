
//C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('imagens')
@Unique(['arqNome', 'arqTipo', 'arqPage']) // garante que não existam conflitos por página
export class ImagensEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  id_default: number;

  @Column({
    type: 'enum',
    enum: [
      'default',
      'logo',
      'avatar',
      'inclusao',
      'alteracao',
      'exclusao',
      'listagem',
      'help',
    ],
    enumName: 'imagens_arqtipo_enum', // opcional, útil para migrations
    nullable: false,
  })
  arqTipo: string; // tipagem no TS será controlada pelo DTO

  // Nome da página ou contexto onde a imagem será usada
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    collation: 'utf8mb4_general_ci',
  })
  arqPage?: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    collation: 'utf8mb4_general_ci',
  })
  arqNome: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    collation: 'utf8mb4_general_ci',
  })
  arqPath: string;

  @Column({ type: 'longblob', nullable: true })
  arqBlob?: Buffer | string | null;

  // Relações opcionais com outras entidades
  @Column({ type: 'int', unsigned: true, nullable: true })
  id_empresas: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  id_consumidores: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  id_clientes: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  id_fornecedores: number | null;

  @Column({ type: 'int', unsigned: true, nullable: true })
  id_funcionarios: number | null;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  createBy: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({ type: 'int', unsigned: true, nullable: false, default: 0 })
  updateBy: number;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}