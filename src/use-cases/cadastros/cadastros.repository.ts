
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CadastrosEntity } from './cadastros.entity';
import { CidadesEntity } from '../cidades/cidades.entity';

export class CadastrosRepository {
  private repo: Repository<CadastrosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CadastrosEntity);
  }
  // criação da tabela Cadastro
  async createCadastros(cadastros: Partial<CadastrosEntity>): Promise<CadastrosEntity> {
    const data = this.repo.create(cadastros);
    return this.repo.save(data);
  }
  // atualização na tabela Cadastros
  async updateCadastros(
    cadastrosId: number,
    cadastros: DeepPartial<CadastrosEntity>,
  ): Promise<CadastrosEntity> {
    const data = this.repo.create({ id: cadastrosId, ...cadastros });
    return this.repo.save(data);
  }
  // exclusão de reg. da tabela Cadastros
  async deleteCadastros(cadastrosId: number): Promise<void> {
    await this.repo.delete(cadastrosId);
  }
  // lista dos reg. da tabela Cadastros
  async findCadastrosAll(where?: FindOptionsWhere<CadastrosEntity>): Promise<CadastrosEntity[]> {
    return this.repo.find({ where });
  }
  // lista de um reg. em tabela Cadastros atraves do ID Cadastros
  async findCadastrosById(cadastrosId: number): Promise<CadastrosEntity | null> {
    return this.repo.findOne({ where: { id: cadastrosId } });
  }
  // lista de um reg. em tabela Cadastros atraves do Endereco
  async findCadastrosByEndereco(endereco: string): Promise<CadastrosEntity | null> {
    return this.repo.findOne({ where: { endereco } });
  }
  // lista todos reg. em tabela Cadastros atraves do endereco
  async findCadastrosByAllEndereco(endereco: string): Promise<CadastrosEntity[] | null> {
    return this.repo.find({ where: { endereco } });
  }
  // lista de um reg. em tabela Cadastros atraves do Complemento
  async findCadastrosByCompl(complemento: string): Promise<CadastrosEntity | null> {
    return this.repo.findOne({ where: { complemento } });
  }
  // lista todos reg. em tabela Cadastro atraves do endereco
  async findCadastrosByAllCompl(complemento: string): Promise<CadastrosEntity[] | null> {
    return this.repo.find({ where: { complemento } });
  }
  // lista de um reg. em tabela Cadastros atraves do bairro
  async findCadastrosByBairro(bairro: string): Promise<CadastrosEntity | null> {
   return this.repo.findOne({ where: { bairro } });
  }
  // lista todos reg. em tabela Cadastro atraves do bairros
  async findCadastrosAllBairro(bairro: string): Promise<CadastrosEntity[]> {
   return this.repo.find({ where: { bairro } });
  }
  // lista dos de um reg. em tabela Cadastro atraves do cep
  async findCadastrosByCep(cep: string): Promise<CadastrosEntity | null> {
    return this.repo.findOne({ where: { cep } });
  }
  // lista todos reg. em tabela Cadastros atraves do cep
  async findCadastrosAllCep(cep: string): Promise<CadastrosEntity[]> {
    return this.repo.find({ where: { cep } });
  }
  // lista todos reg. em tabela Cadastros atraves de mesma pessoa
  async findCadastrosAllPessoaId(pessoaId: number): Promise<CadastrosEntity[]> {
    return this.repo.find({ where: { pessoas: {id: pessoaId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesma empresas
  async findCadastrosAllEmpresaId(empresaId: number): Promise<CadastrosEntity[]> {
    return this.repo.find({ where: { empresas: { id: empresaId } } });
  }
  // lista todos reg. em tabela Cadastros atraves de mesmo Fornecedores
  async findCadastrosAllFornecedorId(fornecedorId: number): Promise<CadastrosEntity[]> {
    return this.repo.find({ where: { fornecedores: { id: fornecedorId } } });
  }
  // lista todos reg. em tabela Cadastros atraves de mesmo Consumidores
  async findCadastrosAllConsumidorId(consumidorId: number): Promise<CadastrosEntity[]> {
    return this.repo.find({ where: { consumidores: { id: consumidorId } } });
  }
  // lista todos reg. em tabela Cadastros atraves de mesmo clientes
  async findCadastrosAllClienteId(clienteId: number): Promise<CadastrosEntity[]> {
    return this.repo.find({ where: { clientes: { id: clienteId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesmo Funcionario
  async findCadastrosAllFuncionarioId(funcionarioId: number): Promise<CadastrosEntity[]> {
    return this.repo.find({ where: { funcionarios: { id: funcionarioId } } });
  }
  
}

