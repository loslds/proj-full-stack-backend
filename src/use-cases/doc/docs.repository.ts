
// C:\repository\proj-full-stack-backend\src\use-cases\doc\docs.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { DocsEntity } from './docs.entity';
import type { DocsCreate } from './docs.dto';

export class DocsRepository {
  private repo: Repository<DocsEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(DocsEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedCpf(
    cpf: string,
    excludes: number[] = []
  ): Promise<DocsEntity | null> {
    const query = this.repo
      .createQueryBuilder('docs')
      .where('docs.cpf = :cpf', { cpf });

    if (excludes.length > 0) {
      query.andWhere('docs.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  async hasDuplicatedCnpj(
    cnpj: string,
    excludes: number[] = []
  ): Promise<DocsEntity | null> {
    const query = this.repo
      .createQueryBuilder('docs')
      .where('docs.cnpj = :cnpj', { cnpj });

    if (excludes.length > 0) {
      query.andWhere('docs.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  async hasDuplicatedInscrEstadual(
    inscr_estadual: string,
    excludes: number[] = []
  ): Promise<DocsEntity | null> {
    const query = this.repo
      .createQueryBuilder('docs')
      .where('docs.inscr_estadual = :inscr_estadual', { inscr_estadual });

    if (excludes.length > 0) {
      query.andWhere('docs.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  async hasDuplicatedInscrMunicipal(
    inscr_municipal: string,
    excludes: number[] = []
  ): Promise<DocsEntity | null> {
    const query = this.repo
      .createQueryBuilder('docs')
      .where('docs.inscr_municipal = :inscr_municipal', { inscr_municipal });

    if (excludes.length > 0) {
      query.andWhere('docs.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findDocsAll(
    where?:
      | FindOptionsWhere<DocsEntity>
      | FindOptionsWhere<DocsEntity>[],
    orderBy: FindOptionsOrder<DocsEntity> = { id: 'ASC' }
  ): Promise<DocsEntity[]> {
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

  async createDocs(docs: DocsCreate): Promise<DocsEntity> {
    const cpf = docs.cpf?.trim() || null;
    const cnpj = docs.cnpj?.trim() || null;
    const inscr_estadual = docs.inscr_estadual?.trim() || null;
    const inscr_municipal = docs.inscr_municipal?.trim() || null;

    if (cpf) {
      const duplicatedCpf = await this.hasDuplicatedCpf(cpf);
      if (duplicatedCpf) {
        throw new Error('CPF já cadastrado!');
      }
    }

    if (cnpj) {
      const duplicatedCnpj = await this.hasDuplicatedCnpj(cnpj);
      if (duplicatedCnpj) {
        throw new Error('CNPJ já cadastrado!');
      }
    }

    if (inscr_estadual) {
      const duplicatedInscrEstadual =
        await this.hasDuplicatedInscrEstadual(inscr_estadual);

      if (duplicatedInscrEstadual) {
        throw new Error('Inscrição estadual já cadastrada!');
      }
    }

    if (inscr_municipal) {
      const duplicatedInscrMunicipal =
        await this.hasDuplicatedInscrMunicipal(inscr_municipal);

      if (duplicatedInscrMunicipal) {
        throw new Error('Inscrição municipal já cadastrada!');
      }
    }

    const data = this.repo.create({
      ...docs,
      cpf,
      cnpj,
      inscr_estadual,
      inscr_municipal,
      createdBy: docs.createdBy ?? 0,
      updatedBy: docs.updatedBy ?? 0
    });

    try {
      return await this.repo.save(data);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new Error('Documento já cadastrado!');
      }

      throw error;
    }
  }

  async findOneDocsById(docsId: number): Promise<DocsEntity | null> {
    this.validateId(docsId);

    return this.repo.findOne({
      where: { id: docsId },
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

  async updateDocsId(
    docsId: number,
    docs: DeepPartial<DocsEntity>
  ): Promise<DocsEntity> {
    this.validateId(docsId);

    const current = await this.repo.findOne({
      where: { id: docsId }
    });

    if (!current) {
      throw new Error(`Documento ID ${docsId} não encontrado.`);
    }

    const cpf =
      docs.cpf !== undefined ? docs.cpf?.trim() || null : current.cpf;
    const cnpj =
      docs.cnpj !== undefined ? docs.cnpj?.trim() || null : current.cnpj;
    const inscr_estadual =
      docs.inscr_estadual !== undefined
        ? docs.inscr_estadual?.trim() || null
        : current.inscr_estadual;
    const inscr_municipal =
      docs.inscr_municipal !== undefined
        ? docs.inscr_municipal?.trim() || null
        : current.inscr_municipal;

    if (cpf && cpf !== current.cpf) {
      const duplicatedCpf = await this.hasDuplicatedCpf(cpf, [docsId]);
      if (duplicatedCpf) {
        throw new Error('CPF já cadastrado!');
      }
    }

    if (cnpj && cnpj !== current.cnpj) {
      const duplicatedCnpj = await this.hasDuplicatedCnpj(cnpj, [docsId]);
      if (duplicatedCnpj) {
        throw new Error('CNPJ já cadastrado!');
      }
    }

    if (
      inscr_estadual &&
      inscr_estadual !== current.inscr_estadual
    ) {
      const duplicatedInscrEstadual =
        await this.hasDuplicatedInscrEstadual(inscr_estadual, [docsId]);

      if (duplicatedInscrEstadual) {
        throw new Error('Inscrição estadual já cadastrada!');
      }
    }

    if (
      inscr_municipal &&
      inscr_municipal !== current.inscr_municipal
    ) {
      const duplicatedInscrMunicipal =
        await this.hasDuplicatedInscrMunicipal(inscr_municipal, [docsId]);

      if (duplicatedInscrMunicipal) {
        throw new Error('Inscrição municipal já cadastrada!');
      }
    }

    const data = this.repo.create({
      ...current,
      ...docs,
      cpf,
      cnpj,
      inscr_estadual,
      inscr_municipal,
      id: docsId
    });

    try {
      return await this.repo.save(data);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new Error('Documento já cadastrado!');
      }

      throw error;
    }
  }

  async deleteDocsId(docsId: number): Promise<boolean> {
    this.validateId(docsId);

    const result = await this.repo.delete(docsId);

    if (result.affected === 0) {
      throw new Error(`Documento ID ${docsId} não encontrado.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS *
  // ============================================================

  /** Pesquisa combinada */
  async searchDocs(params: {
    id?: number;
    id_cadastros?: number;
    cpf?: string;
    cnpj?: string;
    inscr_estadual?: string;
    inscr_municipal?: string;
  }): Promise<DocsEntity[]> {
    const query = this.repo
      .createQueryBuilder('docs')
      .leftJoinAndSelect('docs.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('docs.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('docs.id = :id', { id: params.id });
    }

    if (typeof params.id_cadastros === 'number') {
      query.andWhere('docs.id_cadastros = :id_cadastros', {
        id_cadastros: params.id_cadastros
      });
    }

    if (params.cpf) {
      query.andWhere(
        'docs.cpf LIKE :cpf COLLATE utf8mb4_general_ci',
        { cpf: `%${params.cpf}%` }
      );
    }

    if (params.cnpj) {
      query.andWhere(
        'docs.cnpj LIKE :cnpj COLLATE utf8mb4_general_ci',
        { cnpj: `%${params.cnpj}%` }
      );
    }

    if (params.inscr_estadual) {
      query.andWhere(
        'docs.inscr_estadual LIKE :inscr_estadual COLLATE utf8mb4_general_ci',
        { inscr_estadual: `%${params.inscr_estadual}%` }
      );
    }

    if (params.inscr_municipal) {
      query.andWhere(
        'docs.inscr_municipal LIKE :inscr_municipal COLLATE utf8mb4_general_ci',
        { inscr_municipal: `%${params.inscr_municipal}%` }
      );
    }

    return query.getMany();
  }

  /** Busca um cpf exato */
  async findOneDocsCpf(cpf: string): Promise<DocsEntity | null> {
    return this.repo.findOne({
      where: { cpf },
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

  /** Busca todos cpf exatos */
  async findAllDocsCpf(cpf: string): Promise<DocsEntity[]> {
    return this.repo.find({
      where: { cpf },
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

  /** Busca um cnpj exato */
  async findOneDocsCnpj(cnpj: string): Promise<DocsEntity | null> {
    return this.repo.findOne({
      where: { cnpj },
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

  /** Busca todos cnpj exatos */
  async findAllDocsCnpj(cnpj: string): Promise<DocsEntity[]> {
    return this.repo.find({
      where: { cnpj },
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

  /** Busca uma inscrição estadual exata */
  async findOneDocsInscrEstadual(
    inscr_estadual: string
  ): Promise<DocsEntity | null> {
    return this.repo.findOne({
      where: { inscr_estadual },
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

  /** Busca todas inscrições estaduais exatas */
  async findAllDocsInscrEstadual(
    inscr_estadual: string
  ): Promise<DocsEntity[]> {
    return this.repo.find({
      where: { inscr_estadual },
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

  /** Busca uma inscrição municipal exata */
  async findOneDocsInscrMunicipal(
    inscr_municipal: string
  ): Promise<DocsEntity | null> {
    return this.repo.findOne({
      where: { inscr_municipal },
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

  /** Busca todas inscrições municipais exatas */
  async findAllDocsInscrMunicipal(
    inscr_municipal: string
  ): Promise<DocsEntity[]> {
    return this.repo.find({
      where: { inscr_municipal },
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

  /** Busca parcial por text */
  async searchDocsParcial(text?: string): Promise<DocsEntity[]> {
    const query = this.repo
      .createQueryBuilder('docs')
      .leftJoinAndSelect('docs.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('docs.id', 'ASC');

    if (text && text.trim() !== '') {
      query.andWhere(
        `(docs.cpf LIKE :text
          OR docs.cnpj LIKE :text
          OR docs.inscr_estadual LIKE :text
          OR docs.inscr_municipal LIKE :text) COLLATE utf8mb4_general_ci`,
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  /** Busca todos os docs por cadastro */
  async findAllDocsByCadastrosId(
    cadastrosId: number
  ): Promise<DocsEntity[]> {
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

  /** Lista todos com details */
  async listAllDocsDetails(): Promise<DocsEntity[]> {
    return this.repo
      .createQueryBuilder('docs')
      .leftJoinAndSelect('docs.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('docs.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid docsId');
    }
  }
}

