//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.repository.ts

import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ConsumidoresEntity } from './consumidores.entity';
import type { ConsumidoresCreate } from './consumidores.dto';

export class ConsumidoresRepository {
  private repo: Repository<ConsumidoresEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ConsumidoresEntity);
  }

  // Criação da tabela (raw query) - manter FK
  async createNotExistsConsumidores(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS consumidores (
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
        CONSTRAINT fk_imagens FOREIGN KEY (id_imagens) REFERENCES imagens(id)
      )
    `);
  }

  // Verifica duplicidade por nome/fantasy
  async hasDuplicated(nome?: string, fantasy?: string, excludes: number[] = []) {
    const query = this.repo.createQueryBuilder('consumidores');

    if (nome) query.andWhere('consumidores.nome LIKE :nome', { nome });
    if (fantasy) query.andWhere('consumidores.fantasy LIKE :fantasy', { fantasy });

    if (excludes.length) {
      query.andWhere('consumidores.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // Cria registro 1
  async createConsumidores(consumidores: ConsumidoresCreate): Promise<ConsumidoresEntity> {
    const data = this.repo.create(consumidores);
    return this.repo.save(data);
  }

  // 2 Atualiza registro 
  async updateConsumidores(
    consumidoresId: number,
    consumidores: DeepPartial<ConsumidoresEntity>,
  ): Promise<ConsumidoresEntity> {
    const data = this.repo.create({ id: consumidoresId, ...consumidores });
    return this.repo.save(data);
  }

  // 3 Deleta registro 
  async deleteConsumidores(consumidoresId: number) {
    return this.repo.delete(consumidoresId);
  }

  // 4 Busca todos registros com filtro opcional 
  async findConsumidoresAll(
    where?: FindOptionsWhere<ConsumidoresEntity>,
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<ConsumidoresEntity[]> {
    return this.repo.find({
      where,
      relations: ['pessoas', 'imagens'],
      order: orderBy,
    });
  }

  // 5 Busca por ID em consumidores 
  async findOneConsumidoresById(consumidoresId: number) {
    return this.repo.findOne({
      where: { id: consumidoresId },
      relations: ['pessoas', 'imagens'],
    });
  }

  // Busca por nome 6
  async findOneConsumidoresByNome(nome: string) {
    return this.repo.findOne({
      where: { nome },
      relations: ['pessoas', 'imagens'],
    });
  }


  // Busca por fantasy 7
  async findOneConsumidoresByFantasy(fantasy: string) {
    return this.repo.findOne({
      where: { fantasy },
      relations: ['pessoas', 'imagens'],
    });
  }


  // 8 Pesquisa empresas por ID, nome ou fantasy 
  async searchConsumidores(params: { id?: number; nome?: string; fantasy?: string }) {
    const query = this.repo.createQueryBuilder('consumidores')
      .leftJoinAndSelect('consumidores.pessoas', 'pessoas')
      .leftJoinAndSelect('consumidores.imagens', 'imagens')
      .orderBy('consumidores.id', 'ASC');

    if (params.id) query.andWhere('consumidores.id = :id', { id: params.id });
    if (params.nome) query.andWhere('consumidores.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.fantasy) query.andWhere('consumidores.fantasy LIKE :fantasy', { fantasy: `%${params.fantasy}%` });

    return query.getMany();
  }

  // 9
  async findAllConsumidoresByPessoasId(pessoasId: number) {
    return this.repo.find({ where: { id_pessoas: pessoasId } });
  }

  // 10
  async findAllConsumidoresByImagensId(imagensId: number) {
    return this.repo.find({ where: { id_imagens: imagensId } });
  }

  /** 11 Lista todas consumidores com pessoa + imagem  13*/
  async listAllConsumidoresDetails() {
    return this.repo
      .createQueryBuilder('consumidores')
      .leftJoinAndSelect('consumidores.pessoas', 'pessoas')
      .leftJoinAndSelect('consumidores.imagens', 'imagens')
      .getMany();
  }

  // /** 12 Lista por nome + pessoa  */
  // async findAllEmpresasByNomeAndPessoaId(nome: string, pessoaId: number) {
  //   return this.repo.createQueryBuilder('empresas')
  //     .innerJoinAndSelect('empresas.pessoas', 'pessoas')
  //     .where('empresas.nome LIKE :nome', { nome: `%${nome}%` })
  //     .andWhere('empresas.id_pessoas = :pessoaId', { pessoaId })
  //     .getMany();
  // }

  // /**  13 Lista por nome + imagem  */
  // async findEmpresasByNomeAndImagemId(nome: string, imagemId: number) {
  //   return this.repo.createQueryBuilder('empresas')
  //     .innerJoinAndSelect('empresas.imagens', 'imagens')
  //     .where('empresas.nome LIKE :nome', { nome: `%${nome}%` })
  //     .andWhere('empresas.id_imagens = :imagemId', { imagemId })
  //     .getMany();
  // }

  
}




  


