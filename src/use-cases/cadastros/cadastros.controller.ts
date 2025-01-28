
import { NextFunction, Request, Response } from 'express';
import { CadastrosRepository } from './cadastros.repository';
import { CadastrosCreate, CadastrosUpdate } from './cadastros.dto';
import { CadastrosEntity } from './cadastros.entity';
import { DeepPartial } from 'typeorm';

export class CadastrosController {
  constructor(private readonly cadastrosRepository: CadastrosRepository) {}

  /** POST Cria um novo registro de Cadastro */
  async create(
    req: Request<{}, {}, CadastrosCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cadastros = await this.cadastrosRepository.createCadastros(req.body);
      return res.status(201).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** PATCH Atualiza um registro de Cadastros */
  async update(
    req: Request<{ cadastrosId: string }, {}, CadastrosUpdate>,
    res: Response,
    next: NextFunction
  ) {
    const cadastrosId = Number(req.params.cadastrosId);
    if (isNaN(cadastrosId) || cadastrosId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid cadastrosId' })
        .end();
    }

    try {
      const cadastros = await this.cadastrosRepository.updateCadastros(
        cadastrosId,
        req.body as DeepPartial<CadastrosEntity>
      );
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE Remove um registro de Cadastros */
  async remove(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cadastrosId = Number(req.params.cadastrosId);
    if (isNaN(cadastrosId) || cadastrosId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid cadastrosId' })
        .end();
    }

    try {
      await this.cadastrosRepository.deleteCadastros(cadastrosId);
      return res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Cadastros */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const cadastros = await this.cadastrosRepository.findCadastrosAll();
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Cadastros por ID */
  async getOne(
    req: Request<{ cadastrosId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const cadastrosId = Number(req.params.cadastrosId);

    if (isNaN(cadastrosId) || cadastrosId <= 0) {
      return res
        .status(400)
        .send({ success: false, message: 'Invalid cadastrosId' })
        .end();
    }

    try {
      const cadastros = await this.cadastrosRepository.findCadastrosById(cadastrosId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }
 
  /** GET Busca um registros de Cadastros por endereco */
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
      const cadastros = await this.cadastrosRepository.findCadastrosByEndereco(endereco);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos registros de Cadastros por endereco */
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
      const cadastros = await this.cadastrosRepository.findCadastrosByAllEndereco(endereco);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Cadastros por complemento */
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
      const cadastros = await this.cadastrosRepository.findCadastrosByCompl(complemento);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos registros de Cadastro por complemento */
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
      const cadastros = await this.cadastrosRepository.findCadastrosByAllCompl(complemento);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Cadastros por bairro */  
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
      const cadastros = await this.cadastrosRepository.findCadastrosByBairro(bairro);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registros de Cadastro por bairro */  
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
      const cadastros = await this.cadastrosRepository.findCadastrosAllBairro(bairro);
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
      const cadastros = await this.cadastrosRepository.findCadastrosByCep(cep);
      return res.status(200).send({ success: true, cadastros });
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
      const cadastros = await this.cadastrosRepository.findCadastrosAllCep(cep);
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
      const cadastros = await this.cadastrosRepository.findCadastrosAllPessoaId(pessoaId);
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
      const cadastros = await this.cadastrosRepository.findCadastrosAllEmpresaId(empresaId);
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
      const cadastros = await this.cadastrosRepository.findCadastrosAllFornecedorId(fornecedorId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Busca todos registros de Cadastros com id_consumidor */
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
      const cadastros = await this.cadastrosRepository.findCadastrosAllConsumidorId(consumidorId);
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
      const cadastros = await this.cadastrosRepository.findCadastrosAllClienteId(clienteId);
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
      const cadastros = await this.cadastrosRepository.findCadastrosAllFuncionarioId(funcionarioId);
      return res.status(200).send({ success: true, cadastros });
    } catch (error) {
      next(error);
    }
  }

}