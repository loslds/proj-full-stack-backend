

/// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository,
  IsNull
} from 'typeorm';

import { VisitasEntity } from './visitas.entity';
import type { VisitasCreate } from './visitas.dto';

export class VisitasRepository {
  private repo: Repository<VisitasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(VisitasEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  // Não se aplica para visitas, pois cada registro representa
  // um evento/histórico de entrada e saída.

  // ============================================================
  // * CRUD *
  // ============================================================
  async findVisitasAll(
    where?:
      | FindOptionsWhere<VisitasEntity>
      | FindOptionsWhere<VisitasEntity>[],
    orderBy: FindOptionsOrder<VisitasEntity> = { createdAt: 'DESC' }
  ): Promise<VisitasEntity[]> {
    return this.repo.find({
      where,
      relations: {
        visitantes: true
      },
      order: orderBy
    });
  }

  async findOneVisitasById(
    visitasId: number
  ): Promise<VisitasEntity | null> {
    this.validateId(visitasId);

    return this.repo.findOne({
      where: { id: visitasId },
      relations: {
        visitantes: true
      }
    });
  }

  async updateVisitasId(
    visitasId: number,
    visitas: DeepPartial<VisitasEntity>
  ): Promise<VisitasEntity> {
    this.validateId(visitasId);

    const current = await this.repo.findOne({
      where: { id: visitasId }
    });

    if (!current) {
      throw new Error(`Visita com ID ${visitasId} não encontrada.`);
    }

    const data = this.repo.create({
      ...current,
      ...visitas,
      id: visitasId
    });

    return this.repo.save(data);
  }

  async deleteVisitasId(visitasId: number): Promise<boolean> {
    this.validateId(visitasId);

    const result = await this.repo.delete(visitasId);

    if (result.affected === 0) {
      throw new Error(`Visita com ID ${visitasId} não encontrada.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS PERSONALIZADAS *
  // ============================================================
  async searchVisitas(params: {
    id?: number;
    id_visitantes?: number;
    nome?: string;
    fantasy?: string;
  }): Promise<VisitasEntity[]> {
    const query = this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .orderBy('visitas.createdAt', 'DESC');

    if (typeof params.id === 'number') {
      query.andWhere('visitas.id = :id', { id: params.id });
    }

    if (typeof params.id_visitantes === 'number') {
      query.andWhere('visitas.id_visitantes = :id_visitantes', {
        id_visitantes: params.id_visitantes
      });
    }

    if (params.nome && params.nome.trim() !== '') {
      query.andWhere(
        'visitantes.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${params.nome}%` }
      );
    }

    if (params.fantasy && params.fantasy.trim() !== '') {
      query.andWhere(
        'visitantes.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${params.fantasy}%` }
      );
    }

    return query.getMany();
  }

  async searchNomeVisitas(
    nome?: string
  ): Promise<VisitasEntity[]> {
    const query = this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .orderBy('visitas.createdAt', 'DESC');

    if (nome && nome.trim() !== '') {
      query.andWhere(
        'visitantes.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${nome}%` }
      );
    }

    return query.getMany();
  }

  async searchFantasyVisitas(
    fantasy?: string
  ): Promise<VisitasEntity[]> {
    const query = this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .orderBy('visitas.createdAt', 'DESC');

    if (fantasy && fantasy.trim() !== '') {
      query.andWhere(
        'visitantes.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${fantasy}%` }
      );
    }

    return query.getMany();
  }

  async findAllVisitasByVisitantesId(
    visitantesId: number
  ): Promise<VisitasEntity[]> {
    this.validateId(visitantesId);

    return this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .where('visitas.id_visitantes = :visitantesId', { visitantesId })
      .orderBy('visitas.createdAt', 'DESC')
      .getMany();
  }

  async findHistoricoVisitasByVisitantesId(
    visitantesId: number
  ): Promise<VisitasEntity[]> {
    this.validateId(visitantesId);

    return this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .where('visitas.id_visitantes = :visitantesId', { visitantesId })
      .orderBy('visitas.createdAt', 'DESC')
      .getMany();
  }

  async findHistoricoVisitasByNomeVisitante(
    nome: string
  ): Promise<VisitasEntity[]> {
    const query = this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .orderBy('visitas.createdAt', 'DESC');

    if (nome && nome.trim() !== '') {
      query.andWhere(
        'visitantes.nome LIKE :nome COLLATE utf8mb4_general_ci',
        { nome: `%${nome}%` }
      );
    }

    return query.getMany();
  }

  async findHistoricoVisitasByFantasyVisitante(
    fantasy: string
  ): Promise<VisitasEntity[]> {
    const query = this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .orderBy('visitas.createdAt', 'DESC');

    if (fantasy && fantasy.trim() !== '') {
      query.andWhere(
        'visitantes.fantasy LIKE :fantasy COLLATE utf8mb4_general_ci',
        { fantasy: `%${fantasy}%` }
      );
    }

    return query.getMany();
  }

  async listAllVisitasDetails(): Promise<VisitasEntity[]> {
    return this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .orderBy('visitas.createdAt', 'DESC')
      .getMany();
  }

  async registerEntradaVisitas(
    visitas: VisitasCreate
  ): Promise<VisitasEntity> {
    const data = this.repo.create({
      id_visitantes: visitas.id_visitantes,
      tempo_visita: 0,
      saidaAt: null,
      createdBy: visitas.createdBy ?? 0,
      updatedBy: visitas.updatedBy ?? 0
    });

    return this.repo.save(data);
  }

  async registerSaidaVisitas(
    visitasId: number,
    updatedBy: number = 0
  ): Promise<VisitasEntity> {
    this.validateId(visitasId);

    const current = await this.repo.findOne({
      where: { id: visitasId },
      relations: {
        visitantes: true
      }
    });

    if (!current) {
      throw new Error(`Visita com ID ${visitasId} não encontrada.`);
    }

    const saidaAt = new Date();
    const diffMs = saidaAt.getTime() - new Date(current.createdAt).getTime();
    const tempoVisita = diffMs > 0 ? Math.floor(diffMs / 60000) : 0;

    const data = this.repo.create({
      ...current,
      saidaAt,
      tempo_visita: tempoVisita,
      updatedBy
    });

    return this.repo.save(data);
  }

  async findVisitaAbertaByVisitantesId(
  visitantesId: number
): Promise<VisitasEntity | null> {
  this.validateId(visitantesId);

  return this.repo.findOne({
    where: {
      id_visitantes: visitantesId,
      saidaAt: IsNull()
    },
    relations: {
      visitantes: true
    },
    order: {
      createdAt: 'DESC'
    }
  });
}

  async countVisitasByVisitantesId(
    visitantesId: number
  ): Promise<number> {
    this.validateId(visitantesId);

    return this.repo.count({
      where: { id_visitantes: visitantesId }
    });
  }

  async sumTempoVisitasByVisitantesId(
    visitantesId: number
  ): Promise<number> {
    this.validateId(visitantesId);

    const result = await this.repo
      .createQueryBuilder('visitas')
      .select('COALESCE(SUM(visitas.tempo_visita), 0)', 'total')
      .where('visitas.id_visitantes = :visitantesId', { visitantesId })
      .getRawOne();

    return Number(result?.total ?? 0);
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid visitasId');
    }
  }
}