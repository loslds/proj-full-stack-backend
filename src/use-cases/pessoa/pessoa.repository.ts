import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { PessoaEntity } from './pessoa.entity';
import type { PessoaCreate } from './pessoa.dto';

export class PessoaRepository {
  private repo: Repository<PessoaEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(PessoaEntity);
  }

  async create(pessoa: PessoaCreate): Promise<PessoaEntity> {
    const data = this.repo.create(pessoa);
    return this.repo.save(data);
  }

  async update(
    pessoaId: number,
    pessoa: DeepPartial<PessoaEntity>,
  ): Promise<PessoaEntity> {
    const data = this.repo.create({ id: pessoaId, ...pessoa });
    return this.repo.save(data);
  }

  async delete(pessoaId: number) {
    return this.repo.delete(pessoaId);
  }

  async findPessoaAll(where?: FindOptionsWhere<PessoaEntity>): Promise<PessoaEntity[]> {
    return this.repo.find({ where });
  }

  async findPessoaById(pessoaId: number) {
    return this.repo.findOne({ where: { id: pessoaId } });
  }

  async findPessoaByDescr(descr: string) {
    return this.repo.findOne({ where: { descr } });
  }

}
