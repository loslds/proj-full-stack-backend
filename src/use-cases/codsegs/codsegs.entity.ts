
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CadastrosEntity } from '../cadastros/cadastros.entity';

@Entity('codsegs')

export class CodsegsEntity {
  
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // Relacionamento com a entidade CadastroEntity
  @ManyToOne(() => CadastrosEntity)
  @JoinColumn({ name: 'id_cadastros' })
  cadastros: CadastrosEntity;
  
  @Column({ type: 'int', nullable: false })
  id_cadastros: number;

  ///////////////////////////////////
  
  @Column({ type: 'varchar', length: 255, nullable: true })
  codigo: string;

  //////////////////////////////

  @Column({ type: 'int', nullable: true, default: null })
  createdBy?: number;

  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  updatedBy?: number;

  @Column({
    type: 'datetime',
    nullable: true,
    precision: null,
  })
  updatedAt?: Date;

}
