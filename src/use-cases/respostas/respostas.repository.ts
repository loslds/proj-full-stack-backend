
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { RespostasEntity } from './respostas.entity';

export class RespostasRepository {
  private repo: Repository<RespostasEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(RespostasEntity);
  }
  // criação da tabela Respostas
  async createRespostas(respostas: Partial<RespostasEntity>): Promise<RespostasEntity> {
    const data = this.repo.create(respostas);
    return this.repo.save(data);
  }
  // atualização na tabela Respostas
  async updateRespostas(
    respostasId: number,
    respostas: DeepPartial<RespostasEntity>,
  ): Promise<RespostasEntity> {
    const data = this.repo.create({ id: respostasId, ...respostas });
    return this.repo.save(data);
  }
  // exclusão de reg. da tabela Respostas
  async deleteRespostas(respostasId: number): Promise<void> {
    await this.repo.delete(respostasId);
  }
  // lista dos reg. da tabela Respostas
  async findRespostasAll(where?: FindOptionsWhere<RespostasEntity>): Promise<RespostasEntity[]> {
    return this.repo.find({ where });
  }
  // lista de um reg. em tabela Respostas atraves do ID Respostas
  async findRespostasById(respostasId: number): Promise<RespostasEntity | null> {
    return this.repo.findOne({ where: { id: respostasId } });
  }
  // lista de um reg. em tabela Respostas atraves do perg1
  async findRespostasByPerg1(perg1: string): Promise<RespostasEntity | null> {
    return this.repo.findOne({ where: { perg1} });
  }
  // lista de um reg. em tabela Respostas atraves do perg2
  async findRespostasByPerg2(perg2: string): Promise<RespostasEntity | null> {
    return this.repo.findOne({ where: { perg2} });
  }
  
  // lista de um reg. em tabela Respostas atraves do perg1
  async findRespostasByPerg3(perg3: string): Promise<RespostasEntity | null> {
    return this.repo.findOne({ where: { perg3} });
  }
  
  // lista de um reg. em tabela Respostas atraves do resp1
  async findRespostasByResp1(resp1: string): Promise<RespostasEntity | null> {
    return this.repo.findOne({ where: { resp1} });
  }
  // lista de um reg. em tabela Respostas atraves do resp2
  async findRespostasByResp2(resp2: string): Promise<RespostasEntity | null> {
    return this.repo.findOne({ where: { resp2} });
  }
  
  // lista de um reg. em tabela Respostas atraves do resp1
  async findRespostasByResp3(resp3: string): Promise<RespostasEntity | null> {
    return this.repo.findOne({ where: { resp3} });
  }
  
  
  // Busca todos os registros de Docs pelo campo id_cadastro
    async findRespostasByCadastroId(cadastroId: number): Promise<RespostasEntity[]> {
      if (!cadastroId || isNaN(cadastroId) || cadastroId <= 0) {
        throw new Error('Invalid cadastroId');
      }
  
      return this.repo.find({ where: { id_cadastro: cadastroId } });
    }

}

