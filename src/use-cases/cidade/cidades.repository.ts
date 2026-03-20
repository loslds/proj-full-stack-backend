

// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  Repository
} from 'typeorm';

import { CidadesEntity } from './cidades.entity';
import type { CidadesCreate } from './cidades.dto';
import { CadastrosEntity } from '../cadastro/cadastros.entity';

export class CidadesRepository {
  private repo: Repository<CidadesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CidadesEntity);
  }

  // ==========================================================
  // DUPLICIDADE (nome + id_estados)
  // ==========================================================
  async hasDuplicated(
    nome?: string,
    id_estados?: number,
    excludes: number[] = []
  ): Promise<CidadesEntity | null> {
    const qb = this.repo.createQueryBuilder('cidades');

    if (nome) {
      qb.andWhere('cidades.nome = :nome', { nome });
    }

    if (id_estados) {
      qb.andWhere('cidades.id_estados = :id_estados', { id_estados });
    }

    if (excludes.length > 0) {
      qb.andWhere('cidades.id NOT IN (:...excludes)', { excludes });
    }

    return qb.getOne();
  }

  // ==========================================================
  // CREATE
  // ==========================================================
  async createCidades(cidades: CidadesCreate): Promise<CidadesEntity> {
    const duplicated = await this.hasDuplicated(
      cidades.nome,
      cidades.id_estados
    );

    if (duplicated) {
      throw new Error('Cidade duplicada! Nome e estado já existentes.');
    }

    const data = this.repo.create({
      ...cidades,
      createdBy: cidades.createdBy ?? 0,
      updatedBy: cidades.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  // ==========================================================
  // UPDATE
  // ==========================================================
  async updateCidades(
    cidadesId: number,
    cidades: DeepPartial<CidadesEntity>
  ): Promise<CidadesEntity> {
    const current = await this.repo.findOne({
      where: { id: cidadesId }
    });

    if (!current) {
      throw new Error(`Cidade com ID ${cidadesId} não encontrada.`);
    }

    const nome = cidades.nome ?? current.nome;
    const id_estados = cidades.id_estados ?? current.id_estados;

    const duplicated = await this.hasDuplicated(
      nome,
      id_estados,
      [cidadesId]
    );

    if (duplicated) {
      throw new Error('Cidade duplicada! Nome e estado já existentes.');
    }

    const data = this.repo.create({ ...current, ...cidades, id: cidadesId });
    return this.repo.save(data);
  }

  // ==========================================================
  // DELETE — COM TRAVA DE INTEGRIDADE
  // ==========================================================
  async deleteCidadesId(cidadesId: number): Promise<boolean> {
    const cadRepo = this.dataSource.getRepository(CadastrosEntity);

    const refs = await cadRepo.count({
      where: { id_cidades: cidadesId }
    });

    if (refs > 0) {
      throw new Error(
        `Cidade NÃO pode ser apagada. Existe(m) ${refs} cadastro(s) utilizando esta cidade.`
      );
    }

    const result = await this.repo.delete(cidadesId);

    if (result.affected === 0) {
      throw new Error(`Cidade com ID ${cidadesId} não encontrada.`);
    }

    return true;
  }

  // ==========================================================
  // FIND ALL
  // ==========================================================
  async findCidadesAll(
    where?: FindOptionsWhere<CidadesEntity> | FindOptionsWhere<CidadesEntity>[],
    orderBy: Record<string, 'ASC' | 'DESC'> = { id: 'ASC' }
  ): Promise<CidadesEntity[]> {
    return this.repo.find({
      where: where ?? {},
      relations: ['estado'],
      order: orderBy
    });
  }

  // ==========================================================
  // FIND BY ID
  // ==========================================================
  async findOneCidadesById(cidadesId: number): Promise<CidadesEntity | null> {
    return this.repo.findOne({
      where: { id: cidadesId },
      relations: ['estado']
    });
  }

  // ==========================================================
  // FIND BY NOME
  // ==========================================================
  async findOneCidadesByNome(nome: string): Promise<CidadesEntity | null> {
    return this.repo.findOne({
      where: { nome },
      relations: ['estado']
    });
  }

  // ==========================================================
  // SEARCH (cidade ou estado)
  // ==========================================================
  async searchCidadesByNomeOuEstadoPaginado(
    nomeOuEstado?: string,
    page = 1,
    limit = 100
  ) {
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .orderBy('cidades.nome', 'ASC')
      .skip(skip)
      .take(limit);

    if (nomeOuEstado && nomeOuEstado.trim() !== '') {
      qb.where('cidades.nome LIKE :term', { term: `%${nomeOuEstado}%` })
        .orWhere('estado.nome LIKE :term', { term: `%${nomeOuEstado}%` })
        .orWhere('estado.prefixo LIKE :term', { term: `%${nomeOuEstado}%` });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit
    };
  }

  // ==========================================================
  // LISTAR TUDO (cidade + estado)
  // ==========================================================
  async listAllCidadesDetails() {
    return this.repo
      .createQueryBuilder('cdd')
      .leftJoin('cdd.estado', 'est')
      .select([
        'cdd.id AS cidade_id',
        'cdd.nome AS cidade_nome',
        'est.id AS estado_id',
        'est.nome AS estado_nome',
        'est.prefixo AS estado_prefixo'
      ])
      .orderBy('cdd.nome', 'ASC')
      .getRawMany();
  }

  // ==========================================================
  // FIND ALL BY ESTADO
  // ==========================================================
  async findAllCidadesByIdEstado(
    id_estados: number
  ): Promise<CidadesEntity[]> {
    return this.repo.find({
      where: { id_estados },
      relations: ['estado'],
      order: { nome: 'ASC' }
    });
  }
}


