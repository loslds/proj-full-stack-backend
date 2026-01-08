import type { NextFunction, Request, Response } from 'express';
import type { SetoresRepository } from './setores.repository';
import { SetoresCreate, SetoresUpdate } from './setores.dto';

export class SetoresController {  
  constructor(private readonly setoresRepository: SetoresRepository) {}
  
/** POST Cria Tabela Setores */
async create(
  req: Request<{}, {}, SetoresCreate>,
  res: Response,
  next: NextFunction
) {
  try {
    const setores = await this.setoresRepository.createSetores(req.body);
    return res.status(201).send({ success: true, setores });
  } catch (error) {
    next(error);
  }
}

/** PATCH Atualiza um registro de Setores */
async update(
  req: Request<{ setoresId: string }, {}, Partial<SetoresUpdate>>,
  res: Response,
  next: NextFunction
) {
  const setoresId = Number(req.params.setoresId);
  if (isNaN(setoresId) || setoresId <= 0) {
    return res
      .status(400)
      .send({ success: false, message: 'Invalid setoresId' })
      .end();
  }
  
  try {
    const setores = await this.setoresRepository.updateSetores(setoresId, req.body);
    return res.status(200).send({ success: true, setores }).end();
  } catch (error) {
    next(error);
  }
}
  

  /** DELETE Remove um registro de Setores */
  async remove(
    req: Request<{ setoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const setoresId = Number(req.params.setoresId);
    if (isNaN(setoresId) || setoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid setoresId' }).end();
    }

    try {
      const deleted = await this.setoresRepository.deleteSetores(setoresId);
      return res.status(200).send({ success: !!deleted?.affected });
    } catch (error) {
      next(error);
    }
  }
//////////////////////////////////////////////
  /** GET Busca todos os registros de Empresa */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    
    try {
      const setores = await this.setoresRepository.findSetoresAll();
      return res.status(200).send({ success: true, setores });
    } catch (error) {
      next(error);
    }
  }
    
  /** GET Busca um registro de Setores por ID */
  async getOne(
    req: Request<{ setoresId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const setoresId = Number(req.params.setoresId);

    if (isNaN(setoresId) || setoresId <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid setoresId' }).end();
    }

    try {
      const setores = await this.setoresRepository.findSetoresById(setoresId);
      return res.status(200).send({ success: true, setores });
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca um registro de Empresas por Nome */
  async findByName(
    req: Request<{}, {}, {}, Partial<{ name: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: 'Parâmetro nome é obrigatório.' })
        .end();
    }

    try {
      const setores = await this.setoresRepository.findSetoresByName(name);
      return res.status(200).send({ success: true, setores }).end();
    } catch (error) {
      next(error);
    }
  }

  /** GET Busca registro de Setores por Acao */
  async findByAcao(
    req: Request<{}, {}, {}, Partial<{ acao: string }>>, 
    res: Response, 
    next: NextFunction
  ) {
    const { acao } = req.query;

    if (!acao) {
      return res
        .status(400).send({ success: false, message: 'Parâmetro ação é obrigatório.' }).end();
    }

    try {
      const setores = await this.setoresRepository.findSetoresAllAcao(acao);
      return res.status(200).send({ success: true, setores }).end();
    } catch (error) {
      next(error);
    }
  }
  
  /** GET Busca registros de Setores por Nível */
  async findByNivel(
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    const { nivelInt } = req.query; // Pegando de query params

    if (!nivelInt || Array.isArray(nivelInt)) {
      return res.status(400).json({ message: "Parâmetro niveInt' é obrigatório." });
    }

    const nivel = Number(nivelInt); // Convertendo para número
    if (isNaN(nivel)) {
      return res.status(400).json({ message: "Parâmetro nivel deve ser um número válido." });
    }

    try {

      const setores = await this.setoresRepository.findSetoresAllNivel(nivel);
      return res.status(200).json({ success: true, setores });
    
    } catch (error) {
      next(error);
      }
    }
  }
