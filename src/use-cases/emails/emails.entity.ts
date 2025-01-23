
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CadastroEntity } from '../cadastro/cadastro.entity';

@Entity('emails')
//  @Unique(['mail', 'mailresg']) // Adiciona a restrição de unicidade composta

export class EmailsEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  // Relacionamento com a entidade CadastroEntity
  @ManyToOne(() => CadastroEntity)
  @JoinColumn({ name: 'id_cadastro' })
  cadastro: CadastroEntity;
  
  @Column({ type: 'int', nullable: false })
  id_cadastro: number;

  ///////////////////////////////////
  
  @Column({ type: 'varchar', length: 45, nullable: true })
  mail: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  mailresg: string;

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
