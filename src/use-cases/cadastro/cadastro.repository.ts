
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CadastroEntity } from './cadastro.entity';
import { CidadesEntity } from '../cidade/cidades.entity';

export class CadastroRepository {
  private repo: Repository<CadastroEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CadastroEntity);
  }
  // criação da tabela Cadastro
  async createCadastro(cadastro: Partial<CadastroEntity>): Promise<CadastroEntity> {
    const data = this.repo.create(cadastro);
    return this.repo.save(data);
  }
  // atualização na tabela Cadastro
  async updateCadastro(
    cadastroId: number,
    cadastro: DeepPartial<CadastroEntity>,
  ): Promise<CadastroEntity> {
    const data = this.repo.create({ id: cadastroId, ...cadastro });
    return this.repo.save(data);
  }
  // exclusão de reg. da tabela Cadastro
  async deleteCadastro(cadastroId: number): Promise<void> {
    await this.repo.delete(cadastroId);
  }
  // lista dos reg. da tabela Cadastro
  async findCadastroAll(where?: FindOptionsWhere<CadastroEntity>): Promise<CadastroEntity[]> {
    return this.repo.find({ where });
  }
  // lista de um reg. em tabela Cadastro atraves do ID Cadastro
  async findCadastroById(cadastroId: number): Promise<CadastroEntity | null> {
    return this.repo.findOne({ where: { id: cadastroId } });
  }
  // lista de um reg. em tabela Cadastro atraves do Endereco
  async findCadastroByEndereco(endereco: string): Promise<CadastroEntity | null> {
    return this.repo.findOne({ where: { endereco } });
  }
  // lista todos reg. em tabela Cadastro atraves do endereco
  async findCadastroByAllEndereco(endereco: string): Promise<CadastroEntity[] | null> {
    return this.repo.find({ where: { endereco } });
  }
  // lista de um reg. em tabela Cadastro atraves do Complemento
  async findCadastroByCompl(complemento: string): Promise<CadastroEntity | null> {
    return this.repo.findOne({ where: { complemento } });
  }
  // lista todos reg. em tabela Cadastro atraves do endereco
  async findCadastroByAllCompl(complemento: string): Promise<CadastroEntity[] | null> {
    return this.repo.find({ where: { complemento } });
  }
  // lista de um reg. em tabela Cadastro atraves do bairro
  async findCadastroByBairro(bairro: string): Promise<CadastroEntity | null> {
   return this.repo.findOne({ where: { bairro } });
  }
  // lista todos reg. em tabela Cadastro atraves do bairros
  async findCadastroAllBairro(bairro: string): Promise<CadastroEntity[]> {
   return this.repo.find({ where: { bairro } });
  }
  // lista dos de um reg. em tabela Cadastro atraves do cep
  async findCadastroByCep(cep: string): Promise<CadastroEntity | null> {
    return this.repo.findOne({ where: { cep } });
  }
  // lista todos reg. em tabela Cadastro atraves do cep
  async findCadastroAllCep(cep: string): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { cep } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesma pessoa
  async findCadastroAllPessoaId(pessoaId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { pessoa: {id: pessoaId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesma empresa
  async findCadastroAllEmpresaId(empresaId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { empresa: { id: empresaId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesmo Fornecedor
  async findCadastroAllFornecedorId(fornecedorId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { fornecedor: { id: fornecedorId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesmo Consumidor
  async findCadastroAllConsumidorId(consumidorId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { consumidor: { id: consumidorId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesmo Cliente
  async findCadastroAllClienteId(clienteId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { cliente: { id: clienteId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesmo Funcionario
  async findCadastroAllFuncionarioId(funcionarioId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { funcionario: { id: funcionarioId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesmo Cidades
  async findCadastroAllCidadesId(cidadesId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { cidades: { id: cidadesId } } });
  }
  // lista todos reg. em tabela Cadastro atraves de mesmo Cidades
  async findCadastroAllRespostasId(respostasId: number): Promise<CadastroEntity[]> {
    return this.repo.find({ where: { respostas: { id: respostasId } } });
  }
}

