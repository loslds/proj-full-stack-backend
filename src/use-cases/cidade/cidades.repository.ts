
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CidadesEntity } from './cidades.entity';
import type { CidadesCreate } from './cidades.dto';
import { requiredCidades } from '../../config/cidades';

export class CidadesRepository {
  private repo: Repository<CidadesEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CidadesEntity);
  }

  async createNotExistsCidades() {
    await this.repo.query(`
      CREATE TABLE IF NOT EXISTS cidades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(60) NOT NULL,
        sigla CHAR(5) NOT NULL,
        id_estados INT NOT NULL,
        createdBy INT DEFAULT 0,
        updatedBy INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_estados) REFERENCES estados(id)
      ) ENGINE=InnoDB;
    `);
  }

  // Verifica duplicidade por nome/sigla/id_estados
  async hasDuplicated(
    nome?: string, 
    sigla?: string, 
    id_estados?: number, 
    excludes: number[] = []
  ) {
    const query = this.repo.createQueryBuilder('cidades')
      .where('cidades.nome = :nome', { nome })
      .andWhere('cidades.sigla = :sigla', { sigla })
      .andWhere('cidades.id_estados = :id_estados', { id_estados });

    if (nome) {
      query.andWhere('cidades.nome = :nome', { nome });
    }

    if (sigla) {
      query.andWhere('cidades.sigla = :sigla', { sigla });
    }

    if (id_estados) {
      query.andWhere('cidades.id_estados = :id_estados', { id_estados });
    }

    if (excludes.length) {
      query.andWhere('cidades.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  async insertDefaultCidades() {
    const total = await this.repo.count();
    if (total > 0) return;

    const batchSize = 500;
    for (let i = 0; i < requiredCidades.length; i += batchSize) {
      const batch = requiredCidades.slice(i, i + batchSize);
      await this.repo
        .createQueryBuilder()
        .insert()
        .into(CidadesEntity)
        .values(batch)
        .execute();
    }

    console.log(`✅ ${requiredCidades.length} cidades inseridas em lotes de ${batchSize}`);
  }
//////////////////////////////////////////////////////////////////////////////////////////

// Cria registro 1
  async createCidades(cidades: CidadesCreate): Promise<CidadesEntity> {
    // Verifica duplicidade apenas pelos campos da chave lógica
    const duplicated = await this.hasDuplicated(
      cidades.nome,
      cidades.sigla,
      cidades.id_estados
    );

    if (duplicated) {
      throw new Error('Cidade duplicada! Nome, sigla e Estado já existentes.');
    }

    // Cria e salva a entidade incluindo id_imagens se fornecido
    const data = this.repo.create(cidades);
    return this.repo.save(data);
  }

// 2 Atualiza registro com validação de duplicidade
  async updateCidades(
    cidadesId: number,
    cidades: DeepPartial<CidadesEntity>
    ): Promise<CidadesEntity> {
    // Verifica duplicidade
    const duplicated = await this.repo.createQueryBuilder('cidades')
      .where('cidades.nome = :nome', { nome: cidades.nome })
      .andWhere('cidades.sigla = :sigla', { sigla: cidades.sigla })
      .andWhere('cidades.id_estados = :id_estados', { id_estados: cidades.id_estados })
      .andWhere('cidades.id != :id', { id: cidadesId }) // ignora o próprio registro
      .getOne();

    if (duplicated) {
      // lança erro e não continua
      return Promise.reject(new Error('Cidade duplicada! Nome, Fantasia e Pessoa já existentes.'));
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: cidadesId, ...cidades });
    return this.repo.save(data);
  }
//////////////////////////////////////////////////////////////////////
  
  // 3 Deleta registro 
  async deleteCidadesId(cidadesId: number): Promise<boolean> {
    const result = await this.repo.delete(cidadesId);;
    if (result.affected === 0) {
      throw new Error(`Cicade com ID ${cidadesId} não encontrada.`);
    }
    return true;
  }

  // 4 Busca todos registros com filtro opcional 
  async findCidadesAll(
    where?: FindOptionsWhere<CidadesEntity> | FindOptionsWhere<CidadesEntity>[],
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<CidadesEntity[]> {
    return this.repo.find({
      where: where ?? {},
      relations: ['estados'],
      order: orderBy,
    });
  }

  // 5 Busca por ID 
  async findOneCidadesById(cidadesId: number) {
    return this.repo.findOne({
      where: { id: cidadesId },
      relations: ['estados'],
    });
  }

  
  // 6 Busca por nome 
  async findOneCidadesByNome(nome: string) {
    return this.repo.findOne({
      where: { nome }
    });
  }

  //  7 Busca por sigla 
  async findOneCidadesBySigla(sigla: string) {
    return this.repo.findOne({
      where: { sigla }
    });
  }

  // 8 Pesquisa por nome de cidade ou estado sigla 
  async searchCidadesByNomeOuEstadoPaginado(nomeOuEstado?: string, page = 1, limit = 100) {
    const skip = (page - 1) * limit;

    // 1️⃣ Caso não seja passado nome → retorna todas paginadas
    if (!nomeOuEstado || nomeOuEstado.trim() === '') {
      const [result, total] = await this.repo
        .createQueryBuilder('cidades')
        .leftJoinAndSelect('cidades.estados', 'estados')
        .select([
          'cidades.id',
          'cidades.nome',
          'estados.nome',
          'estados.uf'
        ])
        .orderBy('cidades.nome', 'ASC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { data: result, total };
    }

    // 2️⃣ Primeiro: tenta buscar pelo nome da cidade
    const queryCidades = this.repo
      .createQueryBuilder('cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .select([
        'cidades.id',
        'cidades.nome',
        'estados.nome',
        'estados.uf'
      ])
      .where('cidades.nome LIKE :nome', { nome: `%${nomeOuEstado}%` })
      .orderBy('cidades.nome', 'ASC')
      .skip(skip)
      .take(limit);

    const cidadesEncontradas = await queryCidades.getMany();

    if (cidadesEncontradas.length > 0) {
      const total = await queryCidades.getCount();
      return { data: cidadesEncontradas, total };
    }

    // 3️⃣ Caso não encontre cidades, busca pelo nome do estado ou UF
    const queryEstados = this.repo
      .createQueryBuilder('cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .select([
        'cidades.id',
        'cidades.nome',
        'estados.nome',
        'estados.uf'
      ])
      .where('estados.nome LIKE :estadoNome', { estadoNome: `%${nomeOuEstado}%` })
      .orWhere('estados.uf LIKE :estadoUf', { estadoUf: `%${nomeOuEstado}%` })
      .orderBy('cidades.nome', 'ASC')
      .skip(skip)
      .take(limit);

    const resultEstados = await queryEstados.getMany();
    const totalEstados = await queryEstados.getCount();

    return { data: resultEstados, total: totalEstados };
  }

  async findCidadesByEstado(
    estadoId?: number,
    estadoNomeOuUf?: string,
    page = 1,
    limit = 100
  ) {
    const skip = (page - 1) * limit;

    const query = this.repo
      .createQueryBuilder('cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .select([
        'cidades.id',
        'cidades.nome',
        'estados.id',
        'estados.nome',
        'estados.uf'
      ])
      .orderBy('cidades.nome', 'ASC')
      .skip(skip)
      .take(limit);

    if (estadoId) {
      query.andWhere('estados.id = :estadoId', { estadoId });
    } else if (estadoNomeOuUf) {
      query.andWhere(
        '(estados.nome LIKE :estadoNome OR estados.uf LIKE :estadoUf)',
        { estadoNome: `%${estadoNomeOuUf}%`, estadoUf: `%${estadoNomeOuUf}%` }
      );
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }











/** 11 Lista todas registros cidades + estados*/
  async listAllCidadesDetails() {
    return this.repo
      .createQueryBuilder('cidades')
      .leftJoinAndSelect('cidades.estados', 'estados')
      .getMany();
  }



}
