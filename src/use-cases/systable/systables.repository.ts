 
// //C:\repository\proj-full-stack-backend\src\use-cases\systable\systables.repository.ts
import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder,
} from 'typeorm';

import { SystablesEntity } from './systables.entity';
import type { SystablesCreate } from './systables.dto';

export class SystablesRepository {
  private repo: Repository<SystablesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(SystablesEntity);
  }

  /* =========================
   * CREATE
   * ========================= */
  async createSystables(
    data: SystablesCreate
  ): Promise<SystablesEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  /* =========================
   * UPDATE
   * ========================= */
  async updateSystables(
    id: number,
    data: DeepPartial<SystablesEntity>
  ): Promise<SystablesEntity> {
    if (!id || isNaN(id)) {
      throw new Error('Invalid systablesId');
    }

    const entity = await this.repo.preload({
      id,
      ...data,
    });

    if (!entity) {
      throw new Error(`systables id ${id} não encontrada`);
    }

    return this.repo.save(entity);
  }

  /* =========================
   * VALIDATION
   * ========================= */
  async hasDuplicatedBySystables(
    nome?: string,
    chkdb?: number,
    numberregs?: number,
    excludes: number[] = []
  ): Promise<SystablesEntity | null> {
    const query = this.repo
      .createQueryBuilder('s')
      .where('1 = 1');

    if (nome) {
      query.andWhere('s.nome = :nome', { nome });
    }

    if (chkdb !== undefined) {
      query.andWhere('s.chkdb = :chkdb', { chkdb });
    }

    if (numberregs !== undefined) {
      query.andWhere('s.numberregs = :numberregs', { numberregs });
    }

    if (excludes.length) {
      query.andWhere('s.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  /* =========================
   * DELETE
   * ========================= */
  async deleteSystables(id: number): Promise<void> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`systables id ${id} não encontrada`);
    }

    await this.repo.remove(entity);
  }

  /* =========================
   * READ
   * ========================= */
  async findAllSystables(
    where?: FindOptionsWhere<SystablesEntity>,
    order?: FindOptionsOrder<SystablesEntity>
  ): Promise<SystablesEntity[]> {
    return this.repo.find({ where, order });
  }

  async findOneIdSystables(id: number): Promise<SystablesEntity | null> {
    if (!id || isNaN(id)) {
      throw new Error('Invalid systablesId');
    }
    return this.repo.findOne({ where: { id } });
  }

  async findOneNomeSystables(nome: string): Promise<SystablesEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  /* =========================
   * SEARCH atravé de qualquer parametro
   * ========================= */
  async searchSystables(params: {
    id?: number;
    nome?: string;
    chkdb?: number;
    numberregs?: number;
  }) {
    const query = this.repo
      .createQueryBuilder('s')
      .select(['s.id', 's.nome', 's.chkdb', 's.numberregs'])
      .orderBy('s.nome', 'ASC');

    if (params.id !== undefined) {
      query.andWhere('s.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere('s.nome LIKE :nome', {
        nome: `%${params.nome}%`,
      });
    }

    if (params.chkdb !== undefined) {
      query.andWhere('s.chkdb = :chkdb', {
        chkdb: params.chkdb,
      });
    }

    if (params.numberregs !== undefined) {
      query.andWhere('s.numberregs = :numberregs', {
        numberregs: params.numberregs,
      });
    }

    return query.getMany();
  }

  /* =========================
   * SEARCH (pesquisa) rapida
   * ========================= */
  /** Busca rápida por nome (LIKE) */
  async searchNomeSystables(text?: string) {
    const query = this.repo
      .createQueryBuilder('s')
      .select(['s.id', 's.nome', 's.chkdb', 's.numberregs'])
      .orderBy('s.nome', 'ASC');

    if (text) {
      query.where('s.nome LIKE :text', { text: `%${text}%` });
    }

    return query.getMany();
  }

  /** Busca rápida por chkdb */
  async searchChkdbSystables(chkdb?: number) {
    const query = this.repo
      .createQueryBuilder('s')
      .select(['s.id', 's.nome', 's.chkdb', 's.numberregs'])
      .orderBy('s.nome', 'ASC');

    if (chkdb !== undefined) {
      query.where('s.chkdb = :chkdb', { chkdb });
    }

    return query.getMany();
  }

  /** Busca rápida por numberregs */
  async searchNumberregsSystables(numberregs?: number) {
    const query = this.repo
      .createQueryBuilder('s')
      .select(['s.id', 's.nome', 's.chkdb', 's.numberregs'])
      .orderBy('s.nome', 'ASC');

    if (numberregs !== undefined) {
      query.where('s.numberregs = :numberregs', { numberregs });
    }

    return query.getMany();
  }

  /* =========================
   * LIST HELPERS
   * ========================= */
  async listNomeSystables() {
    return this.repo
      .createQueryBuilder('s')
      .select(['s.id', 's.nome'])
      .orderBy('s.nome', 'ASC')
      .getRawMany();
  }

  async listChkdbSystables(chkdb?: number) {
    const query = this.repo
      .createQueryBuilder('s')
      .select(['s.id', 's.nome', 's.chkdb'])
      .orderBy('s.nome', 'ASC');

    if (chkdb !== undefined) {
      query.where('s.chkdb = :chkdb', { chkdb });
    }

    return query.getRawMany();
  }

  async listNumberregsSystables(numberregs?: number) {
    const query = this.repo
      .createQueryBuilder('s')
      .select(['s.id', 's.nome', 's.chkdb', 's.numberregs'])
      .orderBy('s.nome', 'ASC');

    if (numberregs !== undefined) {
      query.where('s.numberregs = :numberregs', {
        numberregs,
      });
    }

    return query.getRawMany();
  }
}






// import { 
//   DataSource, 
//   DeepPartial, 
//   Repository, 
//   FindOptionsWhere, 
//   FindOptionsOrder 
// } from 'typeorm';
// //import { DataSource, Repository } from 'typeorm';
// //import { SystablesEntity } from './systables.entity';
// import { requiredTables } from '../../system/tables';
// import { SystablesEntity } from './systables.entity';
// import type { SystablesCreate } from './systables.dto';


// export class SystablesRepository {
//   private repo: Repository<SystablesEntity>;
  
//   constructor(private readonly dataSource: DataSource) {
//     this.repo = this.dataSource.getRepository(SystablesEntity);
//   }

//   /** Cria a tabela física se não existir */
//   async createNotExistsSystables(): Promise<void> {
//     await this.dataSource.query(`
//       CREATE TABLE IF NOT EXISTS systables (
//         id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//         nome VARCHAR(60) NOT NULL COLLATE utf8mb4_general_ci UNIQUE,
//         chkdb TINYINT UNSIGNED NOT NULL DEFAULT 0,
//         numberregs INT UNSIGNED NOT NULL DEFAULT 0,
//         createdBy INT UNSIGNED NOT NULL DEFAULT 0,
//         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//         updatedBy INT UNSIGNED NOT NULL DEFAULT 0,
//         updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//       )
//     `);
//   }
 
  // /** Verifica duplicidade */
  // async hasDuplicated(
  //   nome?: string, 
  //   chkdb?: number, 
  //   numberregs?: number, 
  //   excludes: number[] = []
  // ) {
  //   const query = this.repo.createQueryBuilder('systables')
  //     .select()
  //     .where('1 = 1');

  //   if (nome) query.andWhere('systables.nome = :nome', { nome });
  //   if (chkdb !== undefined) query.andWhere('systables.chkdb = :chkdb', { chkdb });
  //   if (numberregs !== undefined) query.andWhere('systables.numberregs = :numberregs', { numberregs });

  //   if (excludes.length) {
  //     query.andWhere('systables.id NOT IN (:...excludes)', { excludes });
  //   }

  //   return query.getOne();
  // }

//   // ==========================================================
//   // INSERT / SYNC DEFAULT SYSTABLES
//   // ==========================================================
// async insertDefaultSystables(): Promise<void> {
//   await this.dataSource.transaction(async manager => {
//     const repo = manager.getRepository(SystablesEntity);

//     for (const tableName of requiredTables) {

//       const tableExists = await manager.query(
//         `
//         SELECT COUNT(*) as total
//         FROM information_schema.tables
//         WHERE table_schema = DATABASE()
//           AND table_name = ?
//         `,
//         [tableName]
//       );

//       const exists = tableExists[0].total > 0;

//       let numberregs = 0;
//       if (exists) {
//         const count = await manager.query(
//           `SELECT COUNT(*) as total FROM \`${tableName}\``
//         );
//         numberregs = count[0].total;
//       }

//       const already = await repo.findOne({
//         where: { nome: tableName }
//       });

//       if (already) {
//         already.chkdb = exists ? 1 : 0;
//         already.numberregs = numberregs;
//         await repo.save(already);
//         continue;
//       }

//       try {
//         await repo.insert({
//           nome: tableName,
//           chkdb: exists ? 1 : 0,
//           numberregs,
//         });
//       } catch (err: any) {
//         if (err.code !== 'ER_DUP_ENTRY') {
//           throw err;
//         }
//       }
//     }
//   });
// }


//   /** Cria tabela */
//   async createSystables(systables: SystablesCreate): Promise<SystablesEntity> {
//     const data = this.repo.create(systables);
//     return this.repo.save(data);
//   }

//   /** Atualiza registros */
//   async updateSystables(
//     systablesId: number, 
//     systables: DeepPartial<SystablesEntity>
//   ): Promise<SystablesEntity> {
//     if (!systablesId || isNaN(systablesId)) {
//       throw new Error('Invalid systablesId');
//     }

//     const entity = await this.repo.preload({
//       id: systablesId,
//       ...systables,
//     });

//     if (!entity) {
//       throw new Error(`systables com id ${systablesId} não encontrada`);
//     }

//     return this.repo.save(entity);
//   }

//   /** Deleta registros */
//   async deleteSystables(systablesId: number): Promise<void> {
//     const entity = await this.repo.findOne({ where: { id: systablesId } });

//     if (!entity) throw new Error(`systables com id ${systablesId} não encontrada`);

//     await this.repo.remove(entity);
//   }

//   /** Busca todos */
//   async findSystablesAll(
//     where?: FindOptionsWhere<SystablesEntity>,
//     order?: FindOptionsOrder<SystablesEntity>
//   ): Promise<SystablesEntity[]> {
//     return this.repo.find({ where, order });
//   }

//   /** Busca pelo ID */
//   async findSystablesById(systablesId: number): Promise<SystablesEntity | null> {
//     if (!systablesId || isNaN(systablesId)) {
//       throw new Error('Invalid systablesId');
//     }
//     return this.repo.findOne({ where: { id: systablesId } });
//   }

//   /** Busca geral */
//   async searchSystables(params: { 
//     id?: number; 
//     nome?: string; 
//     chkdb?: number; 
//     numberregs?: number 
//   }) {
//     const query = this.repo.createQueryBuilder('systables')
//       .select(['systables.id', 'systables.nome', 'systables.chkdb', 'systables.numberregs'])
//       .orderBy('systables.id', 'ASC');

//     if (params.id !== undefined) {
//       query.andWhere('systables.id = :id', { id: params.id });
//     }

//     if (params.nome) {
//       query.andWhere('systables.nome LIKE :nome', { nome: `%${params.nome}%` });
//     }

//     if (params.chkdb !== undefined) {
//       query.andWhere('systables.chkdb = :chkdb', { chkdb: params.chkdb });
//     }

//     if (params.numberregs !== undefined) {
//       query.andWhere('systables.numberregs = :numberregs', { numberregs: params.numberregs });
//     }

//     return query.getMany();
//   }




 
 