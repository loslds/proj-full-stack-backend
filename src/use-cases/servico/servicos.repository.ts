

// C:\repository\proj-full-stack-backend\src\use-cases\servico\servicos.repository.ts

import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder
} from 'typeorm';

 import { ServicosEntity } from './servicos.entity';
 import type { ServicosCreate } from './servicos.dto';

 export class ServicosRepository {
   private repo: Repository<ServicosEntity>;
    constructor(private readonly dataSource: DataSource) {
     this.repo = this.dataSource.getRepository(ServicosEntity);
   }
    // ============================================================
   // * DUPLICIDADE *
   // ============================================================
   async hasDuplicated(
    nome?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder('servicos')
      .select(['servicos.id']);

    if (nome) {
      query.andWhere('servicos.nome = :nome', { nome });
    }

    if (excludeId) {
      query.andWhere('servicos.id != :excludeId', { excludeId });
    }

    const result = await query.getOne();
    return !!result;
  }

    // ============================================================
   // * CRUD *
   // ============================================================
 
   async findServicosAll(
     where?: FindOptionsWhere<ServicosEntity>,
     order?: FindOptionsOrder<ServicosEntity>
   ): Promise<ServicosEntity[]> {
      return this.repo.find({ where, order });
    }
   /////////////////////////
   
   async createServicos(servicos: ServicosCreate): Promise<ServicosEntity> {
    const exists = await this.hasDuplicated(servicos.nome);
 
     if (exists) {
       throw new Error(
         `Servico duplicado! Já existe registro com nome "${servicos.nome}".`
       );
     }
 
     const entity = this.repo.create({
       ...servicos,
       createdBy: servicos.createdBy ?? 0,
       updatedBy: servicos.updatedBy ?? 0
     });
 
     return this.repo.save(entity);
   }
   
   //////////////////////////////
   
   async findServicosById(servicosId: number): Promise<ServicosEntity | null> {
    this.validateId(servicosId);
   
     return this.repo.findOne({
       where: { id: servicosId }
     });
   }
   //////////////////////////////
 
   async updateServicos(
     servicosId: number,
     servicos: DeepPartial<ServicosEntity>
   ): Promise<ServicosEntity> {
     
     this.validateId(servicosId);
 
     const current = await this.repo.findOne({
       where: { id: servicosId }
     });
 
     if (!current) {
       throw new Error(`Servico com id ${servicosId} não encontrado`);
     }
 
     const nome = servicos.nome ?? current.nome;
 
     const exists = await this.hasDuplicated( nome, servicosId );
 
     if (exists) {
       throw new Error(
         `Servico duplicado! Já existe registro com nome "${nome}".`
       );
     }
 
     const entity = await this.repo.preload({
       id: servicosId,
       ...servicos
     });
 
     if (!entity) {
       throw new Error(`Sservico com id ${servicosId} não encontrado`);
     }

     return this.repo.save(entity);
   }
   
   //////////////////////////////
   
   async deleteServicos(servicosId: number): Promise<void> {
      this.validateId(servicosId);
 
     const found = await this.repo.findOne({
       where: { id: servicosId }
     });
 
     if (!found) {
       throw new Error(`Servico com id ${servicosId} não encontrado`);
     }
 
     await this.repo.remove(found);
   }
 
   // ============================================================
   // * CONSULTAS PERSONALIZADAS *
   // ============================================================
   
   async searchServicos(params: {
     id?: number;
     nome?: string;
   }): Promise<ServicosEntity[]> {
     const query = this.repo
       .createQueryBuilder('servicos')
       .select(['servicos.id', 'servicos.nome'])
       .orderBy('servicos.id', 'ASC');
 
     if (params.id) {
       query.andWhere('servicos.id = :id', { id: params.id });
     }
 
     if (params.nome) {
       query.andWhere(
         'servicos.nome LIKE :nome COLLATE utf8mb4_general_ci',
         { nome: `%${params.nome}%` }
       );
     }
 
     return query.getMany();
   }
   ///////////////////////////////
   
   async searchNameServicos(text?: string): Promise<ServicosEntity[]> {
     const query = this.repo
       .createQueryBuilder('servicos')
       .select(['servicos.id', 'servicos.nome'])
       .orderBy('servicos.id', 'ASC')
       .limit(100);
 
     if (text) {
       query.andWhere(
         'servicos.nome LIKE :text COLLATE utf8mb4_general_ci',
         { text: `%${text}%` }
       );
     }
 
     return query.getMany();
   }
   //////////////////////////////////
   
   async findOneNameServicos(nome: string): Promise<ServicosEntity | null> {
     return this.repo.findOne({
       where: { nome }
     });
   }
   /////////////////////////////////
   
   async findAllNameServicos(nome: string): Promise<ServicosEntity[]> {
     return this.repo.find({
       where: { nome },
       order: { id: 'ASC' },
       take: 100
     });
   }
   
   // ============================================================
   // * UTIL *
   // ============================================================
   private validateId(id: number): void {
     if (!id || isNaN(id) || id <= 0) {
       throw new Error('Invalid servicosId');
     }
   }
 }
  
  