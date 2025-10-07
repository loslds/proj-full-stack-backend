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

  // Verifica duplicidade por nome/fantasy e id_pessoas
  async hasDuplicated(
    nome?: string,
    fantasy?: string,
    id_pessoas?: number,
    excludes: number[] = []
  ) {
    const query = this.repo.createQueryBuilder('clientes');

    if (nome) {
      query.andWhere('clientes.nome = :nome', { nome });
    }
    if (fantasy) {
      query.andWhere('clientes.fantasy = :fantasy', { fantasy });
    }
    if (id_pessoas) {
      query.andWhere('clientes.id_pessoa = :id_pessoa', { id_pessoas });
    }

    if (excludes.length) {
      query.andWhere('clientes.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }
  

  // Cria registro 1
  async createClientes(clientes: ClientesCreate): Promise<ClientesEntity> {
    // Verifica duplicidade apenas pelos campos da chave lógica
    const duplicated = await this.hasDuplicated(
      clientes.nome,
      clientes.fantasy,
      clientes.id_pessoas
    );

    if (duplicated) {
      throw new Error('Clientes duplicada! Nome, Fantasia e Pessoa já existentes.');
    }

    // Cria e salva a entidade incluindo id_imagens se fornecido
    const data = this.repo.create(clientes);
    return this.repo.save(data);
  }
  
  // 2 Atualiza registro com validação de duplicidade
  async updateClientesId(
    clientesId: number,
    clientes: DeepPartial<ClientesEntity>
    ): Promise<ClientesEntity> {
    // Verifica duplicidade
    const duplicated = await this.repo.createQueryBuilder('clientes')
      .where('clientes.nome = :nome', { nome: clientes.nome })
      .andWhere('clientes.fantasy = :fantasy', { fantasy: clientes.fantasy })
      .andWhere('clientes.id_pessoas = :id_pessoas', { id_pessoas: clientes.id_pessoas })
      .andWhere('clientes.id != :id', { id: clientesId }) // ignora o próprio registro
      .getOne();

    if (duplicated) {
      throw new Error('Consumidor duplicado! Nome ou Fantasia já existentes.');
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: clientesId, ...clientes });
    return this.repo.save(data);
  }


  // 3 Deleta registro 
  async deleteClientesId(clientesId: number) {
    const result = await this.repo.delete(clientesId);
    if (result.affected === 0) {
      throw new Error(`Cliente com ID ${clientesId} não encontrada.`);
    }
    return true;
  }

  // 4 Busca por ID  
  async findOneClientesById(clientesId: number) {
    return this.repo.findOne({
      where: { id: clientesId },
      relations: ['pessoas', 'imagens'],
    });
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
  async searchClientes(params: { id?: number; nome?: string; fantasy?: string }) {
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

}




  


