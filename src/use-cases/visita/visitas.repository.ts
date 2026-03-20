

// C:\repository\proj-full-stack-backend\src\use-cases\visita\visitas.repository.ts

import {
  DataSource,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { VisitasEntity } from './visitas.entity';
import type { VisitasCreate } from './visitas.dto';

export class VisitasRepository {
  private repo: Repository<VisitasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(VisitasEntity);
  }

  // ==========================================================
  // DELETE
  // ==========================================================
  async deleteVisitasId(visitasId: number): Promise<boolean> {
    const result = await this.repo.delete(visitasId);

    if (result.affected === 0) {
      throw new Error(`Visita com ID ${visitasId} não encontrada.`);
    }

    return true;
  }

  // ==========================================================
  // BUSCA POR ID
  // ==========================================================
  async findOneVisitasById(
    visitasId: number
  ): Promise<VisitasEntity | null> {
    return this.repo.findOne({
      where: { id: visitasId },
      relations: {
        visitantes: true
      }
    });
  }

  // ==========================================================
  // LISTA TODOS
  // ==========================================================
  async findVisitasAll(
    where?: FindOptionsWhere<VisitasEntity> | FindOptionsWhere<VisitasEntity>[],
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

  // ==========================================================
  // PESQUISA GERAL
  // ==========================================================
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

    if (params.id) {
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

  // ==========================================================
  // BUSCA POR NOME DO VISITANTE
  // ==========================================================
  async searchVisitasByNomeVisitante(
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

  // ==========================================================
  // BUSCA POR FANTASY DO VISITANTE
  // ==========================================================
  async searchVisitasByFantasyVisitante(
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

  // ==========================================================
  // LISTA POR ID_VISITANTES
  // ==========================================================
  async findAllVisitasByVisitantesId(
    visitantesId: number
  ): Promise<VisitasEntity[]> {
    return this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .where('visitas.id_visitantes = :visitantesId', { visitantesId })
      .orderBy('visitas.createdAt', 'DESC')
      .getMany();
  }

  // ==========================================================
  // HISTÓRICO DE VISITAS POR VISITANTE
  // ==========================================================
  async findHistoricoVisitasByVisitantesId(
    visitantesId: number
  ): Promise<VisitasEntity[]> {
    return this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .where('visitas.id_visitantes = :visitantesId', { visitantesId })
      .orderBy('visitas.createdAt', 'DESC')
      .getMany();
  }

  // ==========================================================
  // HISTÓRICO DE VISITAS POR NOME DO VISITANTE
  // ==========================================================
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

  // ==========================================================
  // HISTÓRICO DE VISITAS POR FANTASY DO VISITANTE
  // ==========================================================
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

  // ==========================================================
  // LISTA DETALHADA
  // ==========================================================
  async listAllVisitasDetails(): Promise<VisitasEntity[]> {
    return this.repo
      .createQueryBuilder('visitas')
      .leftJoinAndSelect('visitas.visitantes', 'visitantes')
      .orderBy('visitas.createdAt', 'DESC')
      .getMany();
  }

  // ==========================================================
  // REGISTRO DE ENTRADA
  // ==========================================================
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

  // ==========================================================
  // REGISTRO DE SAÍDA
  // ==========================================================
  async registerSaidaVisitas(
    visitasId: number,
    updatedBy: number = 0
  ): Promise<VisitasEntity> {
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
}