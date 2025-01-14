
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CadastroEntity } from './cadastro.entity';
import type { CadastroCreate } from './cadastro.dto';

export class CadastroRepository {
  private repo: Repository<CadastroEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CadastroEntity);
  }

  async createCadastro(cadastro: Partial<CadastroEntity>): Promise<CadastroEntity> {
    const data = this.repo.create(cadastro);
    return this.repo.save(data);
  }

  async updateCadastro(
    cadastroId: number,
    cadastro: DeepPartial<CadastroEntity>,
  ): Promise<CadastroEntity> {
    const data = this.repo.create({ id: cadastroId, ...cadastro });
    return this.repo.save(data);
  }

  async deleteCadastro(cadastroId: number) {
    return this.repo.delete(cadastroId);
  }
  async findCadastroAll(where?: FindOptionsWhere<CadastroEntity>): Promise<CadastroEntity[]> {
    return this.repo.find({ where });
  }
  async findCadastroById(cadastroId: number) {
    return this.repo.findOne({ where: { id: cadastroId } });
  }
  async findCadastroByEndereco(endereco: string) {
    return this.repo.findOne({ where: { endereco } });
  }
  async findCadastroByCep(cep: string) {
    return this.repo.findOne({ where: { cep } });
  }
  async findCadastrosAllCep(cep: string) {
    return this.repo.find({ where: { cep } });
  }
  async findCadastroByBairro(bairro: string) {
    return this.repo.findOne({ where: { bairro } });
  }
  async findCadastroAllBairro(bairro: string) {
    return this.repo.find({ where: { bairro } });
  }
  async findCadastroByCidade(cidade: string) {
    return this.repo.findOne({ where: { cidade } });
  }
  async findCadastroAllCidade(cidade: string) {
    return this.repo.find({ where: { cidade } });
  }
  async findCadastroByPessoaId(pessoaId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { id_pessoa: pessoaId } });
  }
  async findCadastroByEmpresaId(empresaId: number): Promise<CadastroEntity[]> {
        return this.repo.find({ where: { id_empresa: empresaId } });
  }
  async findCadastroByFornecedorId(fornecedorId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { id_fornecedor: fornecedorId } });
  }
  async findCadastroByConsumidorId(consumidorId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { id_consumidor: consumidorId } });
  }
  async findCadastroByClienteId(clienteId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { id_cliente: clienteId } });
  }
  async findCadastroByFuncionarioId(funcionarioId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { id_consumidor: funcionarioId } });
  }
  
  

  
  


  
}

