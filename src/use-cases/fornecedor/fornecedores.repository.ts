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

  // Verifica duplicidade por nome/fantasy
  async hasDuplicated(nome?: string, fantasy?: string, excludes: number[] = []) {
    const query = this.repo.createQueryBuilder('fornecedores');

    if (nome) query.andWhere('fornecedores.nome LIKE :nome', { nome });
    if (fantasy) query.andWhere('fornecedores.fantasy LIKE :fantasy', { fantasy });

    if (excludes.length) {
      query.andWhere('fornecedores.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // Cria registro 1
  async createFornecedores(fornecedores: FornecedoresCreate): Promise<FornecedoresEntity> {
    const data = this.repo.create(fornecedores);
    return this.repo.save(data);
  }

  // 2 Atualiza registro com validação de duplicidade
  async updateFornecedores(
    fornecedoresId: number,
    fornecedores: DeepPartial<FornecedoresEntity>,
  ): Promise<FornecedoresEntity> {
  // Verifica duplicidade
    const duplicated = await this.repo.createQueryBuilder('fornecedores')
      .where('(fornecedores.nome LIKE :nome OR fornecedores.fantasy LIKE :fantasy)', { 
        nome: fornecedores.nome, 
        fantasy: fornecedores.fantasy 
      })
      .andWhere('fornecedores.id != :id', { id: fornecedoresId }) // exclui o próprio
      .getOne();

    if (duplicated) {
      throw new Error('Fornecedor duplicado! Nome ou Fantasia já existentes.');
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: fornecedoresId, ...fornecedores });
    return this.repo.save(data);
  }


  // 3 Deleta registro 
  async deleteFornecedores(fornecedoresId: number) {
    return this.repo.delete(fornecedoresId);
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

  // 5 Busca por ID  
  async findOneFornecedoresById(fornecedoresId: number) {
    return this.repo.findOne({
      where: { id: fornecedoresId },
      relations: ['pessoas', 'imagens'],
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
  async searchAllFornecedores(params: { id?: number; nome?: string; fantasy?: string }) {
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




  


