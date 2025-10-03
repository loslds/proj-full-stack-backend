
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
      .andWhere('cidades.sigla = :sigla', { fantasy: cidades.sigla })
      .andWhere('cidades.id_estados = :id_estados', { id_estados: cidades.id_estados })
      .andWhere('cidades.id != :id', { id: cidadesId }) // ignora o próprio registro
      .getOne();

    if (duplicated) {
      // lança erro e não continua
      return Promise.reject(new Error('Empresa duplicada! Nome, Fantasia e Pessoa já existentes.'));
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: cidadesId, ...cidades });
    return this.repo.save(data);
  }
















  /////////////////////////////////////////////////////////////////////
  

  // Atualiza o conteúdo de um registro de Cidades com o ID fornecido
  

  // Deleta reg. pelo ID
  async deleteCidades(cidadesId: number) {
    return this.repo.delete(cidadesId);
  }

  // Busca um reg. pelo ID
  async findCidadesById(cidadesId: number) {
    return this.repo.findOne({ where: { id: cidadesId } });
  }
  // Busca todos reg.
  async findCidadesAll(where?: FindOptionsWhere<CidadesEntity>): Promise<CidadesEntity[]> {
    return this.repo.find({ where });
  }
  // Busca um reg. nome
  async findCidadesByNmCidade(nome: string) {
    return this.repo.findOne({ where: { nome } });
  }
  // Busca todos reg. nmcidade em Cidades
  async findCidadesAllNmCidade(nome: string) {
    return this.repo.find({ where: { nome } });
  }
  // Busca um reg. nmestado em Cidades
  async findCidadesByNmEstado(nome: string) {
    return this.repo.findOne({ where: { nome } });
  }
  // Busca todos reg. nmestado em Cidade
  async findCidadesAllNmEstado(nmestado: string) {
    return this.repo.find({ where: { nmestado } });
  }
  // Busca todos reg. uf em Cidades
    async findCidadesAllUf(uf: string) {
      return this.repo.find({ where: { uf } });
    }
  // Busca todos os registros de Cidades pelo campo id_cadastro
  async findCidadesByCadastrosId(cadastrosId: number): Promise<CidadesEntity[]> {
    if (!cadastrosId || isNaN(cadastrosId) || cadastrosId <= 0) {
      throw new Error('Invalid cadastroId');
    }

    return this.repo.find({ where: { id_cadastros: cadastrosId } });
  }
}
