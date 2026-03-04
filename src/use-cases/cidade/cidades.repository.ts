
// C:\repository\proj-full-stack-backend\src\use-cases\cidade\cidades.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  Repository
} from "typeorm";

import { CidadesEntity } from "./cidades.entity";
import type { CidadesCreate } from "./cidades.dto";
import { requiredCidades } from "./cidades";

// Importando ENTIDADE real de cadastros
import { CadastrosEntity } from "../cadastro/cadastros.entity"; // ajuste conforme estrutura

export class CidadesRepository {
  private repo: Repository<CidadesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CidadesEntity);
  }

  // ==========================================================
  // CREATE TABLE (Se não existir)
  // ==========================================================
  async createNotExistsCidades() {
    await this.repo.query(`
      CREATE TABLE IF NOT EXISTS cidades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(60) NOT NULL,
        uf CHAR(5) NOT NULL,
        id_estados INT NOT NULL,
        createdBy INT DEFAULT 0,
        updatedBy INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_estados) REFERENCES estados(id)
      ) ENGINE=InnoDB;
    `);
  }

  // ==========================================================
  // VERIFICA DUPLICIDADE (nome + uf + id_estados)
  // ==========================================================
  async hasDuplicated(
    nome?: string,
    uf?: string,
    id_estados?: number,
    excludes: number[] = []
  ) {


    const qb = this.repo.createQueryBuilder('cidades');

    if (nome) {
      qb.andWhere('cidades.nome = :nome', { nome });
    }
    if (uf) {
      qb.andWhere('cidades.uf = :uf', { uf });
    }
    if (id_estados) {
      qb.andWhere('cidades.id_estados = :id_estados', { id_estados });
    }

    if (excludes.length) {
      qb.andWhere('cidades.id NOT IN (:...excludes)', { excludes });
    }

    return qb.getOne();
  }

  // ==========================================================
  // INSERT DEFAULTS EM LOTES
  // ==========================================================
  async insertDefaultCidades() {
    const total = await this.repo.count();
    if (total > 0) return;

    const batchSize = 500;

    for (let i = 0; i < requiredCidades.length; i += batchSize) {
      
      const total = await this.repo.count();
      if (total > 0) return;

      const batchSize = 500;
      
      const batch = requiredCidades.slice(i, i + batchSize);

      await this.repo
        .createQueryBuilder()
        .insert()
        .into(CidadesEntity)
        .values(batch)
        .execute();
    }

    console.log(
      `✅ ${requiredCidades.length} cidades inseridas em lotes de ${batchSize}`
    );
  }

  // ==========================================================
  // CREATE
  // ==========================================================
  async createCidades(cidades: CidadesCreate): Promise<CidadesEntity> {
    // Verifica duplicidade apenas pelos campos da chave lógica
    const duplicated = await this.hasDuplicated(
      cidades.nome,
      cidades.uf,
      cidades.id_estados
    );

    if (duplicated) {
      throw new Error("Cidade duplicada! Nome, UF e Estado já existentes.");
    }

    // Cria e salva a entidade incluindo id_imagens se fornecido
    const data = this.repo.create(cidades);
    return this.repo.save(data);
  }

  // ==========================================================
  // UPDATE
  // ==========================================================
  async updateCidades(
    cidadesId: number,
    cidades: DeepPartial<CidadesEntity>
  ): Promise<CidadesEntity> {

    // Verifica duplicidade
    const qb = this.repo.createQueryBuilder("cidades")
      .where("cidades.id != :id", { id: cidadesId });

    if (cidades.nome)
      qb.andWhere("cidades.nome = :nome", { nome: cidades.nome });

    if (cidades.uf)
      qb.andWhere("cidades.uf = :uf", { uf: cidades.uf });

    if (cidades.id_estados)
      qb.andWhere("cidades.id_estados = :id_estados", { id_estados: cidades.id_estados });

    const duplicated = await qb.getOne();

    if (duplicated) {
      throw new Error("Cidade duplicada! Nome, UF e Estado já existentes.");
    }

    const data = this.repo.create({ id: cidadesId, ...cidades });
    return this.repo.save(data);
  }

  // ==========================================================
  // DELETE — COM TRAVA DE INTEGRIDADE
  // NÃO APAGA SE EXISTIR CADASTROS RELACIONADOS
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
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<CidadesEntity[]> {
    return this.repo.find({
      where: where ?? {},
      relations: ["estados"],
      order: orderBy
    });
  }

  // ==========================================================
  // FIND BY ID
  // ==========================================================
  async findOneCidadesById(cidadesId: number) {
    return this.repo.findOne({
      where: { id: cidadesId },
      relations: ["estados"]
    });
  }

  // ==========================================================
  // FIND BY NOME
  // ==========================================================
  async findOneCidadesByNome(nome: string) {
    return this.repo.findOne({ 
      where: { nome },
      relations: ['estados'] 
    });
  }

  // ==========================================================
  // FIND BY UF
  // ==========================================================
  async findOneCidadesByUf(uf: string) {
    return this.repo.findOne({ 
      where: { uf },
      relations: ['estados'] 
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
      .createQueryBuilder("cidades")
      .leftJoinAndSelect("cidades.estados", "estados")
      .select([
        "cidades.id",
        "cidades.nome",
        "estados.nome",
        "estados.prefixo"
      ])
      .orderBy("cidades.nome", "ASC")
      .skip(skip)
      .take(limit);

    if (!nomeOuEstado || nomeOuEstado.trim() === "") {
      const [data, total] = await qb.getManyAndCount();
      return { data, total };
    }

    qb.where("cidades.nome LIKE :term", { term: `%${nomeOuEstado}%` })
      .orWhere("estados.nome LIKE :term", { term: `%${nomeOuEstado}%` })
      .orWhere("estados.prefixo LIKE :term", { term: `%${nomeOuEstado}%` });

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  // ==========================================================
  // LISTAR TUDO (cidade + estado)
  // ==========================================================
  async listAllCidadesDetails() {
    return this.repo
      .createQueryBuilder("cdd")
      .leftJoinAndSelect("ccd.estados", "est")
      .select([
        'cdd.id AS cidade_id',
        'cdd.nome AS cidade_nome',
        'cdd.uf AS cidade_uf',
        'est.id AS estado_id',
        'est.nome AS estado_nome',
        'est.prefixo AS estado_prefixo',

      ])
      .getMany();
  }

  // ==========================================================
  // FIND ALL BY ESTADO (id_estados)
  // ==========================================================
  async FindAllCidadesByIdEstado(id_estados: number): Promise<CidadesEntity[]> {
    return this.repo.find({
      where: { id_estados },
      relations: ["estados"],
      order: { nome: "ASC" }
    });
  }
}

