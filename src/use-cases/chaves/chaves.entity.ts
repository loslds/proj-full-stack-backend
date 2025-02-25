
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ModulosEntity } from '../modulos/modulos.entity';


@Entity('chaves')

export class ChavesEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number; // O campo 'id' será autoincremento

// Relacionamento com a entidade UsersEntity
  @ManyToOne(() => ModulosEntity)
  @JoinColumn({ name: 'id_modulos' })
  users: ModulosEntity;
  
  @Column({ type: 'int', nullable: false })
  id_modulos: number;

  /////// setor Visitas ////////////
  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  keyVisitas: boolean; // O MySQL armazenará como TINYINT(1)

  /////// setor Recepção ////////////
  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  keyRecepcao: boolean; // O MySQL armazenará como TINYINT(1)

  /////// setor Design ////////////
  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  keyDesign: boolean; // O MySQL armazenará como TINYINT(1)

  /////// setor Produção ////////////
  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  keyProducao: boolean; // O MySQL armazenará como TINYINT(1)

  /////// setor Acabamento ////////////
  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  keyAcabamento: boolean; // O MySQL armazenará como TINYINT(1)

  /////// setor Expedição ////////////
  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  keyExpedicao: boolean; // O MySQL armazenará como TINYINT(1)
  
  /////// setor Administração ////////////
  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  keyAdministracao: boolean; // O MySQL armazenará como TINYINT(1)
  
  /////// setor Master ////////////
  @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
  keyMaster: boolean; // O MySQL armazenará como TINYINT(1)

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


