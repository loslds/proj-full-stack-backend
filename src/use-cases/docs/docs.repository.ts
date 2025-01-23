import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { DocsEntity } from './docs.entity';
import type { DocsCreate } from './docs.dto';

export class DocsRepository {
  private repo: Repository<DocsEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(DocsEntity);
  }

  // Cria um novo registro de Docs
  async createDocs(docs: DocsCreate): Promise<DocsEntity> {
    const data = this.repo.create(docs);
    return this.repo.save(data);
  }

  // Atualiza um registro de Docs pelo ID fornecido
  async updateDocs(
    docsId: number,
    docs: DeepPartial<DocsEntity>,
  ): Promise<DocsEntity> {
    if (!docsId || isNaN(docsId) || docsId <= 0) {
      throw new Error('Invalid docsId');
    }

    await this.repo.update(docsId, docs);
    const updatedDocs = await this.findDocsById(docsId);

    if (!updatedDocs) {
      throw new Error(`Docs with id ${docsId} not found`);
    }

    return updatedDocs;
  }

  // Deleta um registro de Docs pelo ID
  async deleteDocs(docsId: number): Promise<void> {
    if (!docsId || isNaN(docsId) || docsId <= 0) {
      throw new Error('Invalid docsId');
    }

    await this.repo.delete(docsId);
  }

  // Busca todos os registros de Docs com condição opcional
  async findDocsAll(where?: FindOptionsWhere<DocsEntity>): Promise<DocsEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Docs pelo ID
  async findDocsById(docsId: number): Promise<DocsEntity | null> {
    if (!docsId || isNaN(docsId) || docsId <= 0) {
      throw new Error('Invalid docsId');
    }
    return this.repo.findOne({ where: { id: docsId } });
  }

  // Busca todos os registros de Docs pelo campo cpf
  async findDocsAllCpf(cpf: string): Promise<DocsEntity[]> {
    return this.repo.find({ where: { cpf } });
  }

  // Busca um registro de Docs pelo campo inscre
  async findDocsByCpf(cpf: string): Promise<DocsEntity | null> {
    return this.repo.findOne({ where: { cpf } });
  }

  // Busca todos os registros de Docs pelo campo cnpj
  async findDocsAllCnpj(cnpj: string): Promise<DocsEntity[]> {
    return this.repo.find({ where: { cnpj } });
  }

  // Busca um registro de Docs pelo campo cnpj
  async findDocsByCnpj(cnpj: string): Promise<DocsEntity | null> {
    return this.repo.findOne({ where: { cnpj } });
  }

  // Busca todos os registros de Docs pelo campo incre
  async findDocsAllInscre(inscre: string): Promise<DocsEntity[]> {
    return this.repo.find({ where: { inscre } });
  }

  // Busca um registro de Docs pelo campo inscre
  async findDocsByInscre(inscre: string): Promise<DocsEntity | null> {
    return this.repo.findOne({ where: { inscre } });
  }
  
  // Busca todos os registros de Docs pelo campo incrm
  async findDocsAllInscrm(inscrm: string): Promise<DocsEntity[]> {
    return this.repo.find({ where: { inscrm } });
  }

  // Busca um registro de Docs pelo campo inscrm
  async findDocsByInscrm(inscrm: string): Promise<DocsEntity | null> {
    return this.repo.findOne({ where: { inscrm } });
  }
  
  // Busca todos os registros de Docs pelo campo matricula
  async findDocsAllMatric(matricula: string): Promise<DocsEntity[]> {
    return this.repo.find({ where: { matricula } });
  }

  // Busca um registro de Docs pelo campo matricula
  async findDocsByMatric(matricula: string): Promise<DocsEntity | null> {
    return this.repo.findOne({ where: { matricula } });
  }
  
  // Busca todos os registros de Docs pelo campo id_cadastro
  async findDocsByCadastroId(cadastroId: number): Promise<DocsEntity[]> {
    if (!cadastroId || isNaN(cadastroId) || cadastroId <= 0) {
      throw new Error('Invalid cadastroId');
    }

    return this.repo.find({ where: { id_cadastro: cadastroId } });
  }
}
