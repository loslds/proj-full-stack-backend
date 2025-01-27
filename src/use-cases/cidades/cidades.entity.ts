import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CadastroEntity } from '../cadastros/cadastros.entity';

@Entity('cidades')
export class CidadesEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number; // O campo 'id' será autoincremento

  // Relacionamento com a entidade CadastroEntity
  @ManyToOne(() => CadastroEntity)
  @JoinColumn({ name: 'id_cadastro' })
  cadastro: CadastroEntity;
  
  @Column({ type: 'int', nullable: false })
  id_cadastro: number;

  ///////////////////////////////////
  
  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  nmcidade: string;

  @Column({ unique: true, type: 'varchar', length: 45, nullable: false })
  nmestado: string;

  @Column({ unique: true, type: 'varchar', length: 5, nullable: false })
  uf: string;

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
