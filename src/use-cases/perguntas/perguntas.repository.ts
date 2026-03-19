
//C:\repository\proj-full-stack-backend\src\use-cases\perguntas\perguntas.repository.ts
import {
  DataSource,
  DeepPartial,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder
} from 'typeorm';

import { PerguntasEntity } from './perguntas.entity';
import type { PerguntasCreate } from './perguntas.dto';

export class PerguntasRepository {
  private repo: Repository<PerguntasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PerguntasEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================

  async hasDuplicated(
    nome?: string,
    excludeId?: number
  ): Promise<boolean> {
    const query = this.repo
      .createQueryBuilder('perguntas')
      .select(['perguntas.id']);

    if (nome) {
      query.andWhere('perguntas.nome = :nome', { nome });
    }

    if (excludeId) {
      query.andWhere('perguntas.id != :excludeId', { excludeId });
    }

    const result = await query.getOne();
    return !!result;
  }

  // ============================================================
  // * CRUD *
  // ============================================================

  async findPerguntasAll(
    where?: FindOptionsWhere<PerguntasEntity>,
    order?: FindOptionsOrder<PerguntasEntity>
  ): Promise<PerguntasEntity[]> {
    return this.repo.find({ where, order });
  }

  async createPerguntas(pergunta: PerguntasCreate): Promise<PerguntasEntity> {
    const exists = await this.hasDuplicated(pergunta.nome);

    if (exists) {
      throw new Error(
        `Pergunta duplicada! Já existe registro com nome "${pergunta.nome}".`
      );
    }

    const entity = this.repo.create({
      ...pergunta,
      createdBy: pergunta.createdBy ?? 0,
      updatedBy: pergunta.updatedBy ?? 0
    });

    return this.repo.save(entity);
  }

  async findPerguntasById(perguntasId: number): Promise<PerguntasEntity | null> {
    this.validateId(perguntasId);

    return this.repo.findOne({
      where: { id: perguntasId }
    });
  }

  async updatePerguntas(
    perguntasId: number,
    pergunta: DeepPartial<PerguntasEntity>
  ): Promise<PerguntasEntity> {
    this.validateId(perguntasId);

    const current = await this.repo.findOne({
      where: { id: perguntasId }
    });

    if (!current) {
      throw new Error(`Pergunta com id ${perguntasId} não encontrada`);
    }

    const nome = pergunta.nome ?? current.nome;

    const exists = await this.hasDuplicated(nome, perguntasId);

    if (exists) {
      throw new Error(
        `Pergunta duplicada! Já existe registro com nome "${nome}".`
      );
    }

    const entity = await this.repo.preload({
      id: perguntasId,
      ...pergunta
    });

    if (!entity) {
      throw new Error(`Pergunta com id ${perguntasId} não encontrada`);
    }

    return this.repo.save(entity);
  }

  async deletePerguntas(perguntasId: number): Promise<void> {
    this.validateId(perguntasId);

    const found = await this.repo.findOne({
      where: { id: perguntasId }
    });

    if (!found) {
      throw new Error(`Pergunta com id ${perguntasId} não encontrada`);
    }

    await this.repo.remove(found);
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================

  async searchPerguntas(params: {
    id?: number;
    nome?: string;
  }): Promise<PerguntasEntity[]> {
    const query = this.repo
      .createQueryBuilder('perguntas')
      .select(['perguntas.id', 'perguntas.nome'])
      .orderBy('perguntas.id', 'ASC');

    if (params.id) {
      query.andWhere('perguntas.id = :id', { id: params.id });
    }

    if (params.nome) {
      query.andWhere('perguntas.nome LIKE :nome COLLATE utf8mb4_general_ci', {
        nome: `%${params.nome}%`
      });
    }

    return query.getMany();
  }

  async searchNomePerguntas(text?: string): Promise<PerguntasEntity[]> {
    const query = this.repo
      .createQueryBuilder('perguntas')
      .select(['perguntas.id', 'perguntas.nome'])
      .orderBy('perguntas.id', 'ASC')
      .limit(100);

    if (text) {
      query.andWhere('perguntas.nome LIKE :text COLLATE utf8mb4_general_ci', {
        text: `%${text}%`
      });
    }

    return query.getMany();
  }

  async findOneNomePerguntas(nome: string): Promise<PerguntasEntity | null> {
    return this.repo.findOne({ where: { nome } });
  }

  async findAllNomePerguntas(nome: string): Promise<PerguntasEntity[]> {
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
      throw new Error('Invalid perguntasId');
    }
  }
}

