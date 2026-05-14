
// C:\repository\proj-full-stack-backend\src\use-cases\pergresp\pergsresps.repository.ts

import {
  DataSource,
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository
} from 'typeorm';

import { PergsrespsEntity } from './pergsresps.entity';
import type { PergsrespsCreate } from './pergsresps.dto';

export class PergsrespsRepository {
  private repo: Repository<PergsrespsEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PergsrespsEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedPergsresps(
    id_chaves?: number,
    excludes: number[] = []
  ): Promise<PergsrespsEntity | null> {
    const query = this.repo.createQueryBuilder('pergsresps');

    if (typeof id_chaves === 'number') {
      query.andWhere('pergsresps.id_chaves = :id_chaves', { id_chaves });
    }

    if (excludes.length > 0) {
      query.andWhere('pergsresps.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findPergsrespsAll(
    where?: FindOptionsWhere<PergsrespsEntity> | FindOptionsWhere<PergsrespsEntity>[],
    orderBy: FindOptionsOrder<PergsrespsEntity> = { id: 'ASC' }
  ): Promise<PergsrespsEntity[]> {
    return this.repo.find({
      where,
      relations: {
        chaves: {
          users: {
            cadastros: {
              empresas: true,
              visitantes: true,
              consumidores: true,
              clientes: true,
              fornecedores: true,
              funcionarios: true,
              cidades: {
                estados: true
              },
              imagens: true
            }
          }
        }
      },
      order: orderBy
    });
  }

  async createPergsresps(
    pergsresps: PergsrespsCreate
  ): Promise<PergsrespsEntity> {
    const duplicated = await this.hasDuplicatedPergsresps(
      pergsresps.id_chaves ?? 0
    );

    if (duplicated) {
      throw new Error(
        'Perguntas e respostas duplicadas! Já existe vínculo para a chave informada.'
      );
    }

    const data = this.repo.create({
      ...pergsresps,
      id_chaves: pergsresps.id_chaves ?? 0,
      createdBy: pergsresps.createdBy ?? 0,
      updatedBy: pergsresps.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async findOnePergsrespsById(
    pergsrespsId: number
  ): Promise<PergsrespsEntity | null> {
    this.validateId(pergsrespsId);

    return this.repo.findOne({
      where: { id: pergsrespsId },
      relations: {
        chaves: {
          users: {
            cadastros: {
              empresas: true,
              visitantes: true,
              consumidores: true,
              clientes: true,
              fornecedores: true,
              funcionarios: true,
              cidades: {
                estados: true
              },
              imagens: true
            }
          }
        }
      }
    });
  }

  async updatePergsrespsId(
    pergsrespsId: number,
    pergsresps: DeepPartial<PergsrespsEntity>
  ): Promise<PergsrespsEntity> {
    this.validateId(pergsrespsId);

    const current = await this.repo.findOne({
      where: { id: pergsrespsId }
    });

    if (!current) {
      throw new Error(
        `Perguntas e respostas ID ${pergsrespsId} não encontradas.`
      );
    }

    const duplicated = await this.hasDuplicatedPergsresps(
      pergsresps.id_chaves ?? current.id_chaves,
      [pergsrespsId]
    );

    if (duplicated) {
      throw new Error(
        'Perguntas e respostas duplicadas! Já existe vínculo para a chave informada.'
      );
    }

    const data = this.repo.create({
      ...current,
      ...pergsresps,
      id: pergsrespsId
    });

    return this.repo.save(data);
  }

  async deletePergsrespsId(pergsrespsId: number): Promise<boolean> {
    this.validateId(pergsrespsId);

    const result = await this.repo.delete(pergsrespsId);

    if (result.affected === 0) {
      throw new Error(
        `Perguntas e respostas ID ${pergsrespsId} não encontradas.`
      );
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchPergsresps(params: {
    id?: number;
    id_chaves?: number;
    pergunta1?: string;
    resposta1?: string;
    pergunta2?: string;
    resposta2?: string;
    pergunta3?: string;
    resposta3?: string;
    createdBy?: number;
    updatedBy?: number;
  }): Promise<PergsrespsEntity[]> {
    const query = this.repo
      .createQueryBuilder('pergsresps')
      .leftJoinAndSelect('pergsresps.chaves', 'chaves')
      .leftJoinAndSelect('chaves.users', 'users')
      .leftJoinAndSelect('users.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('pergsresps.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('pergsresps.id = :id', { id: params.id });
    }

    if (typeof params.id_chaves === 'number') {
      query.andWhere('pergsresps.id_chaves = :id_chaves', {
        id_chaves: params.id_chaves
      });
    }

    if (params.pergunta1) {
      query.andWhere(
        'pergsresps.pergunta1 LIKE :pergunta1 COLLATE utf8mb4_general_ci',
        { pergunta1: `%${params.pergunta1}%` }
      );
    }

    if (params.resposta1) {
      query.andWhere(
        'pergsresps.resposta1 LIKE :resposta1 COLLATE utf8mb4_general_ci',
        { resposta1: `%${params.resposta1}%` }
      );
    }

    if (params.pergunta2) {
      query.andWhere(
        'pergsresps.pergunta2 LIKE :pergunta2 COLLATE utf8mb4_general_ci',
        { pergunta2: `%${params.pergunta2}%` }
      );
    }

    if (params.resposta2) {
      query.andWhere(
        'pergsresps.resposta2 LIKE :resposta2 COLLATE utf8mb4_general_ci',
        { resposta2: `%${params.resposta2}%` }
      );
    }

    if (params.pergunta3) {
      query.andWhere(
        'pergsresps.pergunta3 LIKE :pergunta3 COLLATE utf8mb4_general_ci',
        { pergunta3: `%${params.pergunta3}%` }
      );
    }

    if (params.resposta3) {
      query.andWhere(
        'pergsresps.resposta3 LIKE :resposta3 COLLATE utf8mb4_general_ci',
        { resposta3: `%${params.resposta3}%` }
      );
    }

    if (typeof params.createdBy === 'number') {
      query.andWhere('pergsresps.createdBy = :createdBy', {
        createdBy: params.createdBy
      });
    }

    if (typeof params.updatedBy === 'number') {
      query.andWhere('pergsresps.updatedBy = :updatedBy', {
        updatedBy: params.updatedBy
      });
    }

    return query.getMany();
  }

  async findAllPergsrespsByChavesId(
    chavesId: number
  ): Promise<PergsrespsEntity[]> {
    return this.repo.find({
      where: {
        id_chaves: chavesId
      },
      relations: {
        chaves: true
      },
      order: {
        id: 'ASC'
      }
    });
  }

  async listAllPergsrespsDetails(): Promise<PergsrespsEntity[]> {
    return this.repo
      .createQueryBuilder('pergsresps')
      .leftJoinAndSelect('pergsresps.chaves', 'chaves')
      .leftJoinAndSelect('chaves.users', 'users')
      .leftJoinAndSelect('users.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('pergsresps.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid pergsrespsId');
    }
  }
}

