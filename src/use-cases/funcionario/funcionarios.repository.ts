
//C:\repository\proj-full-stack-backend\src\use-cases\funcionario\funcionarios.repository.ts

import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { FuncionariosEntity } from './funcionarios.entity';
import type { FuncionariosCreate } from './funcionarios.dto';

export class FuncionariosRepository {

  private repo: Repository<FuncionariosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FuncionariosEntity);
  }

  // Criação da tabela (raw query) - manter FK
  async createNotExistsFuncionarios(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS funcionarios (
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
    const query = this.repo.createQueryBuilder('funcionarios');

    if (nome) {
      query.andWhere('funcionarios.nome = :nome', { nome });
    }
    if (fantasy) {
      query.andWhere('funcionarios.fantasy = :fantasy', { fantasy });
    }
    if (id_pessoas) {
      query.andWhere('funcionarios.id_pessoa = :id_pessoa', { id_pessoas });
    }

    if (excludes.length) {
      query.andWhere('funcionarios.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }
  

  // Cria registro 1
  async createFuncionarios(funcionarios: FuncionariosCreate): Promise<FuncionariosEntity> {
    // Verifica duplicidade apenas pelos campos da chave lógica
    const duplicated = await this.hasDuplicated(
      funcionarios.nome,
      funcionarios.fantasy,
      funcionarios.id_pessoas
    );

    if (duplicated) {
      throw new Error('Funcionario duplicada! Nome, Fantasia e Pessoa já existentes.');
    }

    // Cria e salva a entidade incluindo id_imagens se fornecido
    const data = this.repo.create(funcionarios);
    return this.repo.save(data);
  }
  
  // 2 Atualiza registro com validação de duplicidade
  async updateFuncionariosId(
    funcionariosId: number,
    funcionarios: DeepPartial<FuncionariosEntity>
    ): Promise<FuncionariosEntity> {
    // Verifica duplicidade
    const duplicated = await this.repo.createQueryBuilder('funcionarios')
      .where('funcionarios.nome = :nome', { nome: funcionarios.nome })
      .andWhere('funcionarios.fantasy = :fantasy', { fantasy: funcionarios.fantasy })
      .andWhere('funcionarios.id_pessoas = :id_pessoas', { id_pessoas: funcionarios.id_pessoas })
      .andWhere('funcionarios.id != :id', { id: funcionariosId }) // ignora o próprio registro
      .getOne();

    if (duplicated) {
      throw new Error('Funcionario duplicado! Nome ou Fantasia já existentes.');
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: funcionariosId, ...funcionarios });
    return this.repo.save(data);
  }


  // 3 Deleta registro 
  async deleteFuncionariosId(funcionariosId: number) {
    const result = await this.repo.delete(funcionariosId);
    if (result.affected === 0) {
      throw new Error(`Funcionario com ID ${funcionariosId} não encontrada.`);
    }
    return true;
  }

  // 4 Busca por ID  
  async findOneFuncionariosById(funcionariosId: number) {
    return this.repo.findOne({
      where: { id: funcionariosId },
      relations: ['pessoas', 'imagens'],
    });
  }

  // 4 Busca todos registros com filtro opcional 
  async findFuncionariosAll(
    where?: FindOptionsWhere<FuncionariosEntity>,
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<FuncionariosEntity[]> {
    return this.repo.find({
      where,
      relations: ['pessoas', 'imagens'],
      order: orderBy,
    });
  }

  // Busca por nome 6
  async findOneFuncionariosByNome(nome: string) {
    return this.repo.findOne({
      where: { nome },
      relations: ['pessoas', 'imagens'],
    });
  }


  // Busca por fantasy 7
  async findOneFuncionariosByFantasy(fantasy: string) {
    return this.repo.findOne({
      where: { fantasy },
      relations: ['pessoas', 'imagens'],
    });
  }


  // 8 Pesquisa por ID, nome ou fantasy 
  async searchFuncionarios(params: { id?: number; nome?: string; fantasy?: string }) {
    const query = this.repo.createQueryBuilder('funcionarios')
      .leftJoinAndSelect('funcionarios.pessoas', 'pessoas')
      .leftJoinAndSelect('funcionarios.imagens', 'imagens')
      .orderBy('funcionarios.id', 'ASC');

    if (params.id) query.andWhere('funcionarios.id = :id', { id: params.id });
    if (params.nome) query.andWhere('funcionarios.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.fantasy) query.andWhere('funcionarios.fantasy LIKE :fantasy', { fantasy: `%${params.fantasy}%` });

    return query.getMany();
  }

  // 9
  async findAllFuncionariosByPessoasId(pessoasId: number) {
    return this.repo.find({ where: { id_pessoas: pessoasId } });
  }

  // 10
  async findAllFuncionariosByImagensId(imagensId: number) {
    return this.repo.find({ where: { id_imagens: imagensId } });
  }

  /** 11 Lista todas funcionarios, pessoa + imagem  13*/
  async listAllFuncionariosDetails() {
    return this.repo
      .createQueryBuilder('funcionarios')
      .leftJoinAndSelect('funcionarios.pessoas', 'pessoas')
      .leftJoinAndSelect('funcionarios.imagens', 'imagens')
      .getMany();
  }

}

