
// //C:\repository\proj-full-stack-backend\src\use-cases\imagen\imagens.entity.ts
// src/use-cases/imagem/imagens.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index
} from "typeorm";
import { CadastrosEntity } from "../cadastro/cadastros.entity";

@Entity("imagens")
export class ImagensEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  /** id_cadastros = 0 reservado para imagens padrão do sistema (ft_default.svg, etc)
   * Quando vinculado a um cadastro real, guarda o id do registro em tb_cadastros.
  */
  @Index()
  @Column({ 
    name: "id_cadastros", 
    type: "int", 
    unsigned: true, 
    default: 0 
  })
  id_cadastros: number;

  // Relação opcional para facilitar joins no TypeORM
  @ManyToOne( () => CadastrosEntity, (cad) => (cad as any).imagens, { 
      nullable: true, 
      onDelete: "RESTRICT", 
      onUpdate: "CASCADE" 
    }
  )
  @JoinColumn({ 
    name: "id_cadastros" 
  })
  cadastro?: CadastrosEntity;

  // NOME PARA ARQUIVO
  @Column({ 
    name: "nome", 
    type: "varchar", 
    length: 50 
  })
  nome: string;

  // NOME + EXTENSÃO DO ARQUIVO 
  @Column({ 
    name: "nome_ext", 
    type: "varchar", 
    length: 80 
  })
  nome_ext: string;

  // flags opção tipo de arquivo
  @Column({ 
    name: "has_avatar", 
    type: "tinyint", 
    nullable: false, 
    unsigned: true, 
    default: 0 
  })
  has_avatar: number;

  @Column({ 
    name: "has_logo", 
    type: "tinyint", 
    nullable: false, 
    unsigned: true, 
    default: 0 
  })
  has_logo: number;

  @Column({ 
    name: "has_panel", 
    type: "tinyint", 
    nullable: false, 
    unsigned: true, 
    default: 0 
  })
  has_panel: number;

  @Column({ 
    name: "has_botao", 
    type: "tinyint", 
    nullable: false, 
    unsigned: true, 
    default: 0 
  })
  has_button: number;

  @Column({ 
    name: "has_tabela", 
    type: "tinyint", 
    nullable: false, 
    unsigned: true, 
    default: 0 
  })
  has_tabela: number;

  @Column({ 
    name: "has_foto", 
    type: "tinyint", 
    nullable: false, 
    unsigned: true, 
    default: 0 
  })
  has_foto: number;

  // diretorio em cliente_sevidor
  @Column({ 
    name: "arqDir", 
    type: "varchar", 
    length: 100, 
    default: "C:\\SGB" 
  })
  arqDir: string;

  @Column({ 
    name: "arqPath", 
    type: "varchar", 
    length: 255 
  })
  arqPath: string;

  // Use LONGBLOB se espera imagens pesadas; evita truncamento
  @Column({ 
    name: "arqBlob", 
    type: "longblob" 
  })
  arqBlob: Buffer;

  @Column({ 
    name: "createdBy", 
    type: "int", 
    default: 0 
  })
  createdBy: number;

  @Column({
    name: "createdAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column({ 
    name: "updatedBy", 
    type: "int", 
    default: 0 
  })
  updatedBy: number;

  @Column({
    name: "updatedAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP"
  })
  updatedAt: Date;
}
 