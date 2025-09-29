//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.repository.ts

import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { ClientesEntity } from './clientes.entity';
import type { ClientesCreate } from './clientes.dto';

export class ClientesRepository {
  private repo: Repository<ClientesEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(ClientesEntity);
  }

  // Criação da tabela (raw query) - manter FK
  async createNotExistsClientes(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS clientes (
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
    const query = this.repo.createQueryBuilder('clientes');

    if (nome) query.andWhere('clientes.nome LIKE :nome', { nome });
    if (fantasy) query.andWhere('clientes.fantasy LIKE :fantasy', { fantasy });

    if (excludes.length) {
      query.andWhere('clientes.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // Cria registro 1
  async createClientes(clientes: ClientesCreate): Promise<ClientesEntity> {
    const data = this.repo.create(clientes);
    return this.repo.save(data);
  }

  // 2 Atualiza registro 
  async updateClientes(
    clientesId: number,
    clientes: DeepPartial<ClientesEntity>,
  ): Promise<ClientesEntity> {
    const data = this.repo.create({ id: clientesId, ...clientes });
    return this.repo.save(data);
  }

  // 3 Deleta registro 
  async deleteClientes(clientesId: number) {
    return this.repo.delete(clientesId);
  }

  // 4 Busca todos registros com filtro opcional 
  async findClientesAll(
    where?: FindOptionsWhere<ClientesEntity>,
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<ClientesEntity[]> {
    return this.repo.find({
      where,
      relations: ['pessoas', 'imagens'],
      order: orderBy,
    });
  }

  // 5 Busca por ID em consumidores 
  async findOneClientesById(clientesId: number) {
    return this.repo.findOne({
      where: { id: clientesId },
      relations: ['pessoas', 'imagens'],
    });
  }

  // Busca por nome 6
  async findOneClientesByNome(nome: string) {
    return this.repo.findOne({
      where: { nome },
      relations: ['pessoas', 'imagens'],
    });
  }


  // Busca por fantasy 7
  async findOneClientesByFantasy(fantasy: string) {
    return this.repo.findOne({
      where: { fantasy },
      relations: ['pessoas', 'imagens'],
    });
  }


  // 8 Pesquisa empresas por ID, nome ou fantasy 
  async searchAllClientes(params: { id?: number; nome?: string; fantasy?: string }) {
    const query = this.repo.createQueryBuilder('clientes')
      .leftJoinAndSelect('clientes.pessoas', 'pessoas')
      .leftJoinAndSelect('clientes.imagens', 'imagens')
      .orderBy('clientes.id', 'ASC');

    if (params.id) query.andWhere('clientes.id = :id', { id: params.id });
    if (params.nome) query.andWhere('clientes.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.fantasy) query.andWhere('clientes.fantasy LIKE :fantasy', { fantasy: `%${params.fantasy}%` });

    return query.getMany();
  }

  // 9
  async findAllClientesByPessoasId(pessoasId: number) {
    return this.repo.find({ where: { id_pessoas: pessoasId } });
  }

  // 10
  async findAllClientesByImagensId(imagensId: number) {
    return this.repo.find({ where: { id_imagens: imagensId } });
  }

  /** 11 Lista todas consumidores com pessoa + imagem  13*/
  async listAllClientesDetails() {
    return this.repo
      .createQueryBuilder('clientes')
      .leftJoinAndSelect('clientes.pessoas', 'pessoas')
      .leftJoinAndSelect('clientes.imagens', 'imagens')
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




  


