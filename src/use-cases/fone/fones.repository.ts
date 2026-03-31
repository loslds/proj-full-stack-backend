
// C:\repository\proj-full-stack-backend\src\use-cases\fone\fones.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { FonesEntity } from './fones.entity';
import type { FonesCreate } from './fones.dto';

export class FonesRepository {
  private repo: Repository<FonesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FonesEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedFoneFixo(
    fone_fixo: string,
    excludes: number[] = []
  ): Promise<FonesEntity | null> {
    const query = this.repo
      .createQueryBuilder('fones')
      .where('fones.fone_fixo = :fone_fixo', { fone_fixo });

    if (excludes.length > 0) {
      query.andWhere('fones.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  async hasDuplicatedFoneCelular(
    fone_celular: string,
    excludes: number[] = []
  ): Promise<FonesEntity | null> {
    const query = this.repo
      .createQueryBuilder('fones')
      .where('fones.fone_celular = :fone_celular', { fone_celular });

    if (excludes.length > 0) {
      query.andWhere('fones.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findFonesAll(
    where?:
      | FindOptionsWhere<FonesEntity>
      | FindOptionsWhere<FonesEntity>[],
    orderBy: FindOptionsOrder<FonesEntity> = { id: 'ASC' }
  ): Promise<FonesEntity[]> {
    return this.repo.find({
      where,
      relations: {
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
      },
      order: orderBy
    });
  }

  async createFones(fones: FonesCreate): Promise<FonesEntity> {
    const fone_fixo = fones.fone_fixo?.trim() || null;
    const fone_celular = fones.fone_celular?.trim() || null;
    const fone_contacto = fones.fone_contacto?.trim() || null;

    if (fone_fixo) {
      const duplicatedFixo = await this.hasDuplicatedFoneFixo(fone_fixo);
      if (duplicatedFixo) {
        throw new Error('Telefone fixo já cadastrado!');
      }
    }

    if (fone_celular) {
      const duplicatedCelular = await this.hasDuplicatedFoneCelular(
        fone_celular
      );
      if (duplicatedCelular) {
        throw new Error('Telefone celular já cadastrado!');
      }
    }

    const data = this.repo.create({
      ...fones,
      fone_fixo,
      fone_celular,
      fone_contacto,
      createdBy: fones.createdBy ?? 0,
      updatedBy: fones.updatedBy ?? 0
    });

    try {
      return await this.repo.save(data);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new Error('Telefone já cadastrado!');
      }

      throw error;
    }
  }

  async findOneFonesById(fonesId: number): Promise<FonesEntity | null> {
    this.validateId(fonesId);

    return this.repo.findOne({
      where: { id: fonesId },
      relations: {
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
    });
  }

  async updateFonesId(
    fonesId: number,
    fones: DeepPartial<FonesEntity>
  ): Promise<FonesEntity> {
    this.validateId(fonesId);

    const current = await this.repo.findOne({
      where: { id: fonesId }
    });

    if (!current) {
      throw new Error(`Telefone ID ${fonesId} não encontrado.`);
    }

    const fone_fixo =
      fones.fone_fixo !== undefined
        ? fones.fone_fixo?.trim() || null
        : current.fone_fixo;

    const fone_celular =
      fones.fone_celular !== undefined
        ? fones.fone_celular?.trim() || null
        : current.fone_celular;

    const fone_contacto =
      fones.fone_contacto !== undefined
        ? fones.fone_contacto?.trim() || null
        : current.fone_contacto;

    if (fone_fixo && fone_fixo !== current.fone_fixo) {
      const duplicatedFixo = await this.hasDuplicatedFoneFixo(
        fone_fixo,
        [fonesId]
      );

      if (duplicatedFixo) {
        throw new Error('Telefone fixo já cadastrado!');
      }
    }

    if (fone_celular && fone_celular !== current.fone_celular) {
      const duplicatedCelular = await this.hasDuplicatedFoneCelular(
        fone_celular,
        [fonesId]
      );

      if (duplicatedCelular) {
        throw new Error('Telefone celular já cadastrado!');
      }
    }

    const data = this.repo.create({
      ...current,
      ...fones,
      fone_fixo,
      fone_celular,
      fone_contacto,
      id: fonesId
    });

    try {
      return await this.repo.save(data);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new Error('Telefone já cadastrado!');
      }

      throw error;
    }
  }

  async deleteFonesId(fonesId: number): Promise<boolean> {
    this.validateId(fonesId);

    const result = await this.repo.delete(fonesId);

    if (result.affected === 0) {
      throw new Error(`Telefone ID ${fonesId} não encontrado.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS *
  // ============================================================
  async searchFones(params: {
    id?: number;
    id_cadastros?: number;
    fone_fixo?: string;
    fone_celular?: string;
    fone_contacto?: string;
  }): Promise<FonesEntity[]> {
    const query = this.repo
      .createQueryBuilder('fones')
      .leftJoinAndSelect('fones.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('fones.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('fones.id = :id', { id: params.id });
    }

    if (typeof params.id_cadastros === 'number') {
      query.andWhere('fones.id_cadastros = :id_cadastros', {
        id_cadastros: params.id_cadastros
      });
    }

    if (params.fone_fixo) {
      query.andWhere(
        'fones.fone_fixo LIKE :fone_fixo COLLATE utf8mb4_general_ci',
        { fone_fixo: `%${params.fone_fixo}%` }
      );
    }

    if (params.fone_celular) {
      query.andWhere(
        'fones.fone_celular LIKE :fone_celular COLLATE utf8mb4_general_ci',
        { fone_celular: `%${params.fone_celular}%` }
      );
    }

    if (params.fone_contacto) {
      query.andWhere(
        'fones.fone_contacto LIKE :fone_contacto COLLATE utf8mb4_general_ci',
        { fone_contacto: `%${params.fone_contacto}%` }
      );
    }

    return query.getMany();
  }

  async findOneFonesFixo(
    fone_fixo: string
  ): Promise<FonesEntity | null> {
    return this.repo.findOne({
      where: { fone_fixo },
      relations: {
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
    });
  }

  async findAllFonesFixo(fone_fixo: string): Promise<FonesEntity[]> {
    return this.repo.find({
      where: { fone_fixo },
      relations: {
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
      },
      order: { id: 'ASC' }
    });
  }

  async findOneFonesCelular(
    fone_celular: string
  ): Promise<FonesEntity | null> {
    return this.repo.findOne({
      where: { fone_celular },
      relations: {
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
    });
  }

  async findAllFonesCelular(
    fone_celular: string
  ): Promise<FonesEntity[]> {
    return this.repo.find({
      where: { fone_celular },
      relations: {
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
      },
      order: { id: 'ASC' }
    });
  }

  async findOneFonesContacto(
    fone_contacto: string
  ): Promise<FonesEntity | null> {
    return this.repo.findOne({
      where: { fone_contacto },
      relations: {
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
    });
  }

  async findAllFonesContacto(
    fone_contacto: string
  ): Promise<FonesEntity[]> {
    return this.repo.find({
      where: { fone_contacto },
      relations: {
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
      },
      order: { id: 'ASC' }
    });
  }

  async searchFonesParcial(text?: string): Promise<FonesEntity[]> {
    const query = this.repo
      .createQueryBuilder('fones')
      .leftJoinAndSelect('fones.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('fones.id', 'ASC');

    if (text && text.trim() !== '') {
      query.andWhere(
        `(fones.fone_fixo LIKE :text
          OR fones.fone_celular LIKE :text
          OR fones.fone_contacto LIKE :text) COLLATE utf8mb4_general_ci`,
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  async findAllFonesByCadastrosId(
    cadastrosId: number
  ): Promise<FonesEntity[]> {
    return this.repo.find({
      where: { id_cadastros: cadastrosId },
      relations: {
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
      },
      order: { id: 'ASC' }
    });
  }

  async listAllFonesDetails(): Promise<FonesEntity[]> {
    return this.repo
      .createQueryBuilder('fones')
      .leftJoinAndSelect('fones.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('fones.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid fonesId');
    }
  }
}