//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.repository.ts

import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { FornecedoresEntity } from './fornecedores.entity';
import type { FornecedoresCreate } from './fornecedores.dto';

export class FornecedoresRepository {
  private repo: Repository<FornecedoresEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FornecedoresEntity);
  }

  // Criação da tabela (raw query) - manter FK
  async createNotExistsFornecedores(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS fornecedores (
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

  // Verifica duplicidade por nome/fantasy e id_pessoas
  async hasDuplicated(
    nome?: string,
    fantasy?: string,
    id_pessoas?: number,
    excludes: number[] = []
  ) {
    const query = this.repo.createQueryBuilder('fornecedores');

    if (nome) {
      query.andWhere('fornecedores.nome = :nome', { nome });
    }
    if (fantasy) {
      query.andWhere('fornecedores.fantasy = :fantasy', { fantasy });
    }
    if (id_pessoas) {
      query.andWhere('fornecedores.id_pessoa = :id_pessoa', { id_pessoas });
    }

    if (excludes.length) {
      query.andWhere('fornecedores.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }
  

  // Cria registro 1
  async createFornecedores(fornecedores: FornecedoresCreate): Promise<FornecedoresEntity> {
    // Verifica duplicidade apenas pelos campos da chave lógica
    const duplicated = await this.hasDuplicated(
      fornecedores.nome,
      fornecedores.fantasy,
      fornecedores.id_pessoas
    );

    if (duplicated) {
      throw new Error('Fornecedor duplicada! Nome, Fantasia e Pessoa já existentes.');
    }

    // Cria e salva a entidade incluindo id_imagens se fornecido
    const data = this.repo.create(fornecedores);
    return this.repo.save(data);
  }
  
  // 2 Atualiza registro com validação de duplicidade
  async updateFornecedoresId(
    fornecedoresId: number,
    fornecedores: DeepPartial<FornecedoresEntity>
    ): Promise<FornecedoresEntity> {
    // Verifica duplicidade
    const duplicated = await this.repo.createQueryBuilder('fornecedores')
      .where('fornecedores.nome = :nome', { nome: fornecedores.nome })
      .andWhere('fornecedores.fantasy = :fantasy', { fantasy: fornecedores.fantasy })
      .andWhere('fornecedores.id_pessoas = :id_pessoas', { id_pessoas: fornecedores.id_pessoas })
      .andWhere('fornecedores.id != :id', { id: fornecedoresId }) // ignora o próprio registro
      .getOne();

    if (duplicated) {
      throw new Error('Fornecedor duplicado! Nome ou Fantasia já existentes.');
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: fornecedoresId, ...fornecedores });
    return this.repo.save(data);
  }


  // 3 Deleta registro 
  async deleteFornecedoresId(fornecedoresId: number) {
    const result = await this.repo.delete(fornecedoresId);
    if (result.affected === 0) {
      throw new Error(`Fornecdor com ID ${fornecedoresId} não encontrada.`);
    }
    return true;
  }

  // 4 Busca por ID  
  async findOneFornecedoresById(fornecedoresId: number) {
    return this.repo.findOne({
      where: { id: fornecedoresId },
      relations: ['pessoas', 'imagens'],
    });
  }

  // 4 Busca todos registros com filtro opcional 
  async findFornecedoresAll(
    where?: FindOptionsWhere<FornecedoresEntity>,
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<FornecedoresEntity[]> {
    return this.repo.find({
      where,
      relations: ['pessoas', 'imagens'],
      order: orderBy,
    });
  }

  // Busca por nome 6
  async findOneFornecedoresByNome(nome: string) {
    return this.repo.findOne({
      where: { nome },
      relations: ['pessoas', 'imagens'],
    });
  }


  // Busca por fantasy 7
  async findOneFornecedoresByFantasy(fantasy: string) {
    return this.repo.findOne({
      where: { fantasy },
      relations: ['pessoas', 'imagens'],
    });
  }


  // 8 Pesquisa empresas por ID, nome ou fantasy 
  async searchFornecedores(params: { id?: number; nome?: string; fantasy?: string }) {
    const query = this.repo.createQueryBuilder('fornecedores')
      .leftJoinAndSelect('fornecedores.pessoas', 'pessoas')
      .leftJoinAndSelect('fornecedores.imagens', 'imagens')
      .orderBy('fornecedores.id', 'ASC');

    if (params.id) query.andWhere('fornecedores.id = :id', { id: params.id });
    if (params.nome) query.andWhere('fornecedores.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.fantasy) query.andWhere('fornecedores.fantasy LIKE :fantasy', { fantasy: `%${params.fantasy}%` });

    return query.getMany();
  }

  // 9
  async findAllFornecedoresByPessoasId(pessoasId: number) {
    return this.repo.find({ where: { id_pessoas: pessoasId } });
  }

  // 10
  async findAllFornecedoresByImagensId(imagensId: number) {
    return this.repo.find({ where: { id_imagens: imagensId } });
  }

  /** 11 Lista todas consumidores com pessoa + imagem  13*/
  async listAllFornecedoresDetails() {
    return this.repo
      .createQueryBuilder('fornecedores')
      .leftJoinAndSelect('fornecedores.pessoas', 'pessoas')
      .leftJoinAndSelect('fornecedores.imagens', 'imagens')
      .getMany();
  }

}




  


