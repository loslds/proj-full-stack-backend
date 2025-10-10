import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { EmpresasEntity } from './empresas.entity';
import type { EmpresasCreate } from './empresas.dto';

export class EmpresasRepository {
  private repo: Repository<EmpresasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmpresasEntity);
  }

  // Criação da tabela (raw query) - manter FK
  async createNotExistsEmpresas(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS empresas (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        id_pessoas INT UNSIGNED NOT NULL,
        id_imagens INT UNSIGNED NOT NULL,
        nome VARCHAR(60) NOT NULL,
        fantasy VARCHAR(60) NOT NULL,
        createdBy INT DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedBy INT DEFAULT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_pessoas FOREIGN KEY (id_pessoas) REFERENCES pessoas(id),
        CONSTRAINT fk_imagens FOREIGN KEY (id_imagens) REFERENCES imagens(id),
      )
    `);
  }

  async hasDuplicated(
    nome?: string,
    fantasy?: string,
    id_pessoas?: number,
    excludes: number[] = []
  ) {
    const query = this.repo.createQueryBuilder('empresas');

    if (nome) {
      query.andWhere('empresas.nome = :nome', { nome });
    }
    if (fantasy) {
      query.andWhere('empresas.fantasy = :fantasy', { fantasy });
    }
    if (id_pessoas) {
      query.andWhere('empresas.id_pessoa = :id_pessoa', { id_pessoas });
    }

    if (excludes.length) {
      query.andWhere('empresas.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }


  // Cria registro 1
  async createEmpresas(empresas: EmpresasCreate): Promise<EmpresasEntity> {
    // Verifica duplicidade apenas pelos campos da chave lógica
    const duplicated = await this.hasDuplicated(
      empresas.nome,
      empresas.fantasy,
      empresas.id_pessoas
    );

    if (duplicated) {
      throw new Error('Empresa duplicada! Nome, Fantasia e Pessoa já existentes.');
    }

    // Cria e salva a entidade incluindo id_imagens se fornecido
    const data = this.repo.create(empresas);
    return this.repo.save(data);
  }

  // 2 Atualiza registro com validação de duplicidade
  async updateEmpresas(
    empresasId: number,
    empresas: DeepPartial<EmpresasEntity>
    ): Promise<EmpresasEntity> {
    // Verifica duplicidade
    const duplicated = await this.repo.createQueryBuilder('empresas')
      .where('empresas.nome = :nome', { nome: empresas.nome })
      .andWhere('empresas.fantasy = :fantasy', { fantasy: empresas.fantasy })
      .andWhere('empresas.id_pessoas = :id_pessoas', { id_pessoas: empresas.id_pessoas })
      .andWhere('empresas.id != :id', { id: empresasId }) // ignora o próprio registro
      .getOne();

    if (duplicated) {
      // lança erro e não continua
      return Promise.reject(new Error('Empresa duplicada! Nome, Fantasia e Pessoa já existentes.'));
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: empresasId, ...empresas });
    return this.repo.save(data);
  }

  // 3 Deleta registro 
  async deleteEmpresasId(empresasId: number): Promise<boolean> {
    const result = await this.repo.delete(empresasId);
    if (result.affected === 0) {
      throw new Error(`Empresa com ID ${empresasId} não encontrada.`);
    }
    return true;
  }

  // 4 Busca por ID em empesas 
  async findOneEmpresasById(empresasId: number) {
    return this.repo.findOne({
      where: { id: empresasId },
      relations: ['pessoas', 'imagens'],
    });
  }

  // 5 Busca todos registros com filtro opcional 
  async findEmpresasAll(
    where?: FindOptionsWhere<EmpresasEntity> | FindOptionsWhere<EmpresasEntity>[],
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<EmpresasEntity[]> {
    return this.repo.find({
      where: where ?? {},
      relations: ['pessoas', 'imagens'],
      order: orderBy,
    });
  }


  // Busca por nome 6
  async findOneEmpresasByNome(nome: string) {
    return this.repo.findOne({
      where: { nome },
      relations: ['pessoas', 'imagens'],
    });
  }


  // Busca por fantasy 7
  async findOneEmpresasByFantasy(fantasy: string) {
    return this.repo.findOne({
      where: { fantasy },
      relations: ['pessoas', 'imagens'],
    });
  }


  // 8 Pesquisa empresas por ID, nome ou fantasy 
  async searchEmpresas(params: { id?: number; nome?: string; fantasy?: string }) {
    const query = this.repo.createQueryBuilder('empresas')
      .leftJoinAndSelect('empresas.pessoas', 'pessoas')
      .leftJoinAndSelect('empresas.imagens', 'imagens')
      .orderBy('empresas.id', 'ASC');

    if (params.id) query.andWhere('empresas.id = :id', { id: params.id });
    if (params.nome) query.andWhere('empresas.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.fantasy) query.andWhere('empresas.fantasy LIKE :fantasy', { fantasy: `%${params.fantasy}%` });

    return query.getMany();
  }

  // 9
  async findAllEmpresasByPessoasId(pessoasId: number) {
    return this.repo.find({ where: { id_pessoas: pessoasId } });
  }

  // 10
  async findAllEmpresasByImagensId(imagensId: number) {
    return this.repo.find({ where: { id_imagens: imagensId } });
  }

  /** 11 Lista todas empresas com pessoa + imagem  13*/
  async listAllEmpresasDetails() {
    return this.repo
      .createQueryBuilder('empresas')
      .leftJoinAndSelect('empresas.pessoas', 'pessoas')
      .leftJoinAndSelect('empresas.imagens', 'imagens')
      .getMany();
  }

}




  


