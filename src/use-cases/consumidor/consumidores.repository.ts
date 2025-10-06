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
  async hasDuplicated(
    nome?: string,
    fantasy?: string,
    id_pessoas?: number,
    excludes: number[] = []
  ) {
    const query = this.repo.createQueryBuilder('consumidores');

    if (nome) {
      query.andWhere('consumidores.nome = :nome', { nome });
    }
    if (fantasy) {
      query.andWhere('consumidores.fantasy = :fantasy', { fantasy });
    }
    if (id_pessoas) {
      query.andWhere('consumidores.id_pessoa = :id_pessoa', { id_pessoas });
    }

    if (excludes.length) {
      query.andWhere('consumidores.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }
  

  // Cria registro 1
  async createConsumidores(consumidores: ConsumidoresCreate): Promise<ConsumidoresEntity> {
    // Verifica duplicidade apenas pelos campos da chave lógica
    const duplicated = await this.hasDuplicated(
      consumidores.nome,
      consumidores.fantasy,
      consumidores.id_pessoas
    );

    if (duplicated) {
      throw new Error('Consumidores duplicada! Nome, Fantasia e Pessoa já existentes.');
    }

    // Cria e salva a entidade incluindo id_imagens se fornecido
    const data = this.repo.create(consumidores);
    return this.repo.save(data);
  }
  
  // 2 Atualiza registro com validação de duplicidade
  async updateConsumidoresId(
    consumidoresId: number,
    consumidores: DeepPartial<ConsumidoresEntity>
        ): Promise<ConsumidoresEntity> {
    // Verifica duplicidade
    const duplicated = await this.repo.createQueryBuilder('consumidores')
      .where('consumidores.nome = :nome', { nome: consumidores.nome })
      .andWhere('consumidores.fantasy = :fantasy', { fantasy: consumidores.fantasy })
      .andWhere('consumidores.id_pessoas = :id_pessoas', { id_pessoas: consumidores.id_pessoas })
      .andWhere('consumidores.id != :id', { id: consumidoresId }) // ignora o próprio registro
      .getOne();

    if (duplicated) {
      throw new Error('Consumidor duplicado! Nome ou Fantasia já existentes.');
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: consumidoresId, ...consumidores });
    return this.repo.save(data);
  }


  // 3 Deleta registro 
  async deleteConsumidoresId(consumidoresId: number) {
    const result = await this.repo.delete(consumidoresId);
    if (result.affected === 0) {
      throw new Error(`Consumidor com ID ${consumidoresId} não encontrada.`);
    }
    return true;
  }

  // 4 Busca por ID em consumidores 
  async findOneConsumidoresById(consumidoresId: number) {
    return this.repo.findOne({
      where: { id: consumidoresId },
      relations: ['pessoas', 'imagens'],
    });
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

}




  


