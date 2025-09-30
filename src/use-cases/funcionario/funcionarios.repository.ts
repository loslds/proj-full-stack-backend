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
        id_empresas INT UNSIGNED NOT NULL,
        id_imagens INT UNSIGNED NOT NULL,
        nome VARCHAR(60) NOT NULL,
        fantasy VARCHAR(60) NOT NULL,
        createdBy INT DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedBy INT DEFAULT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_empresas FOREIGN KEY (id_empresas) REFERENCES empresas(id),
        CONSTRAINT fk_imagens FOREIGN KEY (id_imagens) REFERENCES imagens(id)
      )
    `);
  }

  // Verifica duplicidade por nome/fantasy
  async hasDuplicated(nome?: string, fantasy?: string, excludes: number[] = []) {
    const query = this.repo.createQueryBuilder('funcionarios');

    if (nome) query.andWhere('funcionarios.nome LIKE :nome', { nome });
    if (fantasy) query.andWhere('funcionarios.fantasy LIKE :fantasy', { fantasy });

    if (excludes.length) {
      query.andWhere('funcionarios.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // Cria registro 1
  async createFuncionarios(funcionarios: FuncionariosCreate): Promise<FuncionariosEntity> {
    const data = this.repo.create(funcionarios);
    return this.repo.save(data);
  }

  // 2 Atualiza registro com validação de duplicidade
  async updateFuncionariosId(
    funcionariosId: number,
    funcionarios: DeepPartial<FuncionariosEntity>,
  ): Promise<FuncionariosEntity> {
    // Verifica duplicidade
    const duplicated = await this.repo.createQueryBuilder('empresas')
      .where('(funcionarios.nome LIKE :nome OR funcionarios.fantasy LIKE :fantasy)', { 
        nome: funcionarios.nome, 
        fantasy: funcionarios.fantasy 
      })
      .andWhere('funcionarios.id != :id', { id: funcionariosId }) // exclui o próprio
      .getOne();

    if (duplicated) {
      throw new Error('Funcionarios duplicado! Nome ou Fantasia já existentes.');
    }

    // Se passou pela validação, segue o update
    const data = this.repo.create({ id: funcionariosId, ...funcionarios });
    return this.repo.save(data);
  }  
  
  // 3 Deleta registro 
  async deleteFuncionarios(funcionariosId: number) {
    return this.repo.delete(funcionariosId);
  }

  // 4 Busca todos registros com filtro opcional 
  async findFuncionariosAll(
    where?: FindOptionsWhere<FuncionariosEntity>,
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<FuncionariosEntity[]> {
    return this.repo.find({
      where,
      relations: ['empresas', 'imagens'],
      order: orderBy,
    });
  }

  // 5 Busca por ID em empesas 
  async findOneFuncionariosById(funcionariosId: number) {
    return this.repo.findOne({
      where: { id: funcionariosId },
      relations: ['empresas', 'imagens'],
    });
  }

  // Busca por nome 6
  async findOneFuncionariosByNome(nome: string) {
    return this.repo.findOne({
      where: { nome },
      relations: ['empresas', 'imagens'],
    });
  }


  // Busca por fantasy 7
  async findOneFuncionariosByFantasy(fantasy: string) {
    return this.repo.findOne({
      where: { fantasy },
      relations: ['empresas', 'imagens'],
    });
  }


  // 8 Pesquisa por ID, nome ou fantasy 
  async searchFuncionarios(params: { id?: number; nome?: string; fantasy?: string }) {
    const query = this.repo.createQueryBuilder('funcionarios')
      .leftJoinAndSelect('funcionarios.empresas', 'empresas')
      .leftJoinAndSelect('funcionarios.imagens', 'imagens')
      .orderBy('funcionarios.id', 'ASC');

    if (params.id) query.andWhere('funcionarios.id = :id', { id: params.id });
    if (params.nome) query.andWhere('funcionarios.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.fantasy) query.andWhere('funcionarios.fantasy LIKE :fantasy', { fantasy: `%${params.fantasy}%` });

    return query.getMany();
  }

  // 9
  async findAllFuncionariosByEmpresasId(empresasId: number) {
    return this.repo.find({ where: { id_empresas: empresasId } });
  }

  // 10
  async findAllFuncionariosByImagensId(imagensId: number) {
    return this.repo.find({ where: { id_imagens: imagensId } });
  }

  /** 11 Lista todas com empresas + imagem  13*/
  async listAllFuncionariosDetails() {
    return this.repo
      .createQueryBuilder('funcionarios')
      .leftJoinAndSelect('funcionarios.empresas', 'empresas')
      .leftJoinAndSelect('funcionarios.imagens', 'imagens')
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




  


