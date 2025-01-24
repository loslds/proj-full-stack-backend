
import { NextFunction, Request, Response } from 'express';
import { CadastroRepository } from './cadastro.repository';
import { CadastroCreate, CadastroUpdate } from './cadastro.dto';
import { CadastroEntity } from './cadastro.entity';
import { DeepPartial } from 'typeorm';

export class CadastroController {
  constructor(private readonly cadastroRepository: CadastroRepository) {}

  /** POST Cria um novo registro de Cadastro */
  async create(
    req: Request<{}, {}, CadastroCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastro = await this.cadastroRepository.createCadastro(req.body);
      return res.status(201).send({ success: true, cadastro });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Cadastro */
  async update(
    req: Request<{ cadastroId: string }, {}, CadastroUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const cadastroId = Number(req.params.cadastroId);
    if (isNaN(cadastroId) || cadastroId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid cadastroId' })
        .end();
    }

    try {
      const cadastro = await this.cadastroRepository.updateCadastro(
        cadastroId,
        req.body as DeepPartial<CadastroEntity>
      );
      return res.status(200).send({ success: true, cadastro });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Cadastro */
  async remove(
    req: Request<{ cadastroId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cadastroId = Number(req.params.cadastroId);
    if (isNaN(cadastroId) || cadastroId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid cadastroId' })
        .end();
    }

    try {
      await this.cadastroRepository.deleteCadastro(cadastroId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Cadastro */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const cadastros = await this.cadastroRepository.findCadastroAll();
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Cadastro por ID */
  async getOne(
    req: Request<{ cadastroId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cadastroId = Number(req.params.cadastroId);

    if (isNaN(cadastroId) || cadastroId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid cadastroId' })
        .end();
    }

    try {
      const cadastro = await this.cadastroRepository.findCadastroById(cadastroId);
      return res.status(200).send({ success: true, cadastro });
    } catch (error) {
      next(error);
    }
  }
 
  /** GET Busca um registros de Cadastro por endereço */
  async findByEndereco(
    req: Request<{}, {}, {}, { endereco: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { endereco } = req.query;

    if (!endereco) {
      return res
        .status(400)
        .send({ success: false, message: 'Endereço parameter is required' })
        .end();
    }

    try {
      const cadastro = await this.cadastroRepository.findCadastroByEndereco(endereco);
      return res.status(200).send({ success: true, cadastro });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos registros de Cadastro por endereço */
  async findAllEndereco(
    req: Request<{}, {}, {}, { endereco: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { endereco } = req.query;

    if (!endereco) {
      return res
        .status(400)
        .send({ success: false, message: 'Endereço parameter is required' })
        .end();
    }

    try {
      const cadastros = await this.cadastroRepository.findCadastroByAllEndereco(endereco);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Cadastro por endereço */
  async findByCompl(
    req: Request<{}, {}, {}, { complemento: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { complemento } = req.query;

    if (!complemento) {
      return res
        .status(400)
        .send({ success: false, message: 'Complemento parameter is required' })
        .end();
    }

    try {
      const cadastro = await this.cadastroRepository.findCadastroByCompl(complemento);
      return res.status(200).send({ success: true, cadastro });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos registros de Cadastro por endereço */
  async findAllCompl(
    req: Request<{}, {}, {}, { complemento: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { complemento } = req.query;

    if (!complemento) {
      return res
        .status(400)
        .send({ success: false, message: 'Complemento parameter is required' })
        .end();
    }

    try {
      const cadastros = await this.cadastroRepository.findCadastroByAllCompl(complemento);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Cadastro por Bairro */  
  async findByBairro(
    req: Request<{}, {}, {}, { bairro: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { bairro } = req.query;

    if (!bairro) {
      return res
        .status(400)
        .send({ success: false, message: 'Bairro parameter is required' })
        .end();
    }

    try {
      const cadastro = await this.cadastroRepository.findCadastroByBairro(bairro);
      return res.status(200).send({ success: true, cadastro });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Cadastro por Bairro */  
  async findAllBairro(
    req: Request<{}, {}, {}, { bairro: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { bairro } = req.query;

    if (!bairro) {
      return res
        .status(400)
        .send({ success: false, message: 'Bairro parameter is required' })
        .end();
    }

    try {
      const cadastros = await this.cadastroRepository.findCadastroAllBairro(bairro);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Cadastro por CEP */
  async findByCep(
    req: Request<{}, {}, {}, { cep: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { cep } = req.query;

    if (!cep) {
      return res
        .status(400)
        .send({ success: false, message: 'Cep parameter is required' })
        .end();
    }

    try {
      const cadastro = await this.cadastroRepository.findCadastroByCep(cep);
      return res.status(200).send({ success: true, cadastro });
    } catch (error) {
      next(error);
    }
  }


  /** GET Busca todos registros de Cadastro por CEP */
  async findAllCep(
    req: Request<{}, {}, {}, { cep: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    const { cep } = req.query;

    if (!cep) {
      return res
        .status(400)
        .send({ success: false, message: 'Cep parameter is required' })
        .end();
    }

    try {
      const cadastros = await this.cadastroRepository.findCadastroAllCep(cep);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos registros de Cadastro com id_pessoa */
  async findAllPessoaId(
    req: Request<{ pessoaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoaId = Number(req.params.pessoaId);
    if (isNaN(pessoaId) || pessoaId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid pessoaId' })
        .end();
    }

    try {
      const cadastros = await this.cadastroRepository.findCadastroAllPessoaId(pessoaId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Busca todos registros de Cadastro com id_empresa */
  async findAllEmpresaId(
    req: Request<{ empresaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresaId = Number(req.params.empresaId);
    if (isNaN(empresaId) || empresaId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid empresaId' })
        .end();
    }

    try {
      const cadastros = await this.cadastroRepository.findCadastroAllEmpresaId(empresaId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos registros de Cadastro com id_fornecedor */
  async findAllFornecedorId(
    req: Request<{ fornecedorId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const fornecedorId = Number(req.params.fornecedorId);
    if (isNaN(fornecedorId) || fornecedorId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid fornecedorId' })
        .end();
    }

    try {
      const cadastros = await this.cadastroRepository.findCadastroAllFornecedorId(fornecedorId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Busca todos registros de Cadastro com id_consumidor */
  async findAllConsumidorId(
    req: Request<{ consumidorId: string } >,
    res: Response,
    next: NextFunction
  ) {
    const consumidorId =  Number(req.params.consumidorId);
    if (isNaN(consumidorId) || consumidorId <= 0) {
      return res
      .status(400)
      .send({ success: false, message: 'Invalid consumidorId' })
      .end();
    }
    try {
      const cadastros = await this.cadastroRepository.findCadastroAllConsumidorId(consumidorId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos registros de Cadastro com id_cliente */
  async findAllClienteId(
    req: Request<{ clienteId: string } >,
    res: Response,
    next: NextFunction
  ) {
    const clienteId =  Number(req.params.clienteId);
    if (isNaN(clienteId) || clienteId <= 0) {
      return res
      .status(400)
      .send({ success: false, message: 'Invalid clienteId' })
      .end();
    }
    try {
      const cadastros = await this.cadastroRepository.findCadastroAllClienteId(clienteId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos registros de Cadastro com id_funcionario */
  async findAllFuncionarioId(
    req: Request<{ funcionarioId: string } >,
    res: Response,
    next: NextFunction
  ) {
    const funcionarioId =  Number(req.params.funcionarioId);
    if (isNaN(funcionarioId) || funcionarioId <= 0) {
      return res
      .status(400)
      .send({ success: false, message: 'Invalid funcionarioId' })
      .end();
    }
    try {
      const cadastros = await this.cadastroRepository.findCadastroAllFuncionarioId(funcionarioId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

}