
import type { NextFunction, Request, Response } from 'express';
import type { CadastroRepository } from './cadastro.repository';
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
    req: Request<{ cadastroId: string }, {}, Partial<CadastroUpdate>>,
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
        req.body as DeepPartial<CadastroEntity> // Conversão explícita para DeepPartial
      );
      return res.status(200).send({ success: true, cadastro }).end();
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
      return res.status(400).send({ success: false, message: 'Invalid cadastroId' }).end();
    }

    try {
      const deleted = await this.cadastroRepository.deleteCadastro(cadastroId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todos os registros de Cadastro */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
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
      return res.status(400).send({ success: false, message: 'Invalid cadastroId' }).end();
    }

    try {
      const cadastro = await this.cadastroRepository.findCadastroById(cadastroId);
      return res.status(200).send({ success: true, cadastro });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Cadastro por Endereco */
  async findByEndereco(
    req: Request<{}, {}, {}, Partial<{ endereco: string }>>, 
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
      return res.status(200).send({ success: true, cadastro }).end();
    } catch (error) {
      next(error);
    }
  }
 
  /** GET Busca um registro de Cadastro por Bairro */
  async findByBairro(
    req: Request<{}, {}, {}, Partial<{ bairro: string }>>, 
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
      return res.status(200).send({ success: true, cadastro }).end();
    } catch (error) {
      next(error);
    }
  }
 
  /** GET Busca um registro em Cadastro por Cidade */
  async findByCidade(
    req: Request<{}, {}, {}, Partial<{ cidade: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { cidade } = req.query;

    if (!cidade) {
      return res
        .status(400)
        .send({ success: false, message: 'Cidade parameter is required' })
        .end();
    }

    try {
      const cadastro = await this.cadastroRepository.findCadastroByBairro(cidade);
      return res.status(200).send({ success: true, cadastro }).end();
    } catch (error) {
      next(error);
    }
  }
   
  /** GET Busca um registro de Cadastro por CEP */
  async findByCep(
    req: Request<{}, {}, {}, Partial<{ cep: string }>>, 
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
      const cadastro = await this.cadastroRepository.findCadastroByBairro(cep);
      return res.status(200).send({ success: true, cadastro }).end();
    } catch (error) {
      next(error);
    }
  }




















  /** GET Busca todas as empresas pelo ID de Pessoa */
  async findAllByPessoaId(
    req: Request<{ pessoaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const pessoaId = Number(req.params.pessoaId);
    if (isNaN(pessoaId) || pessoaId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid pessoaId' }).end();
    }

    try {
      const clientes = await this.clienteRepository.findClientesAllByPessoaId(pessoaId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca todas as empresas pelo ID de Pessoa */
  async findAllByEmpresaId(
    req: Request<{ empresaId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const empresaId = Number(req.params.empresaId);
    if (isNaN(empresaId) || empresaId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid empresaId' }).end();
    }

    try {
      const clientes = await this.clienteRepository.findClientesAllByEmpresaId(empresaId);
      return res.status(200).send({ success: true, clientes });
    } catch (error) {
      next(error);
    }
  }
}

