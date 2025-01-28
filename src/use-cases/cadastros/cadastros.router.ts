
import { Router, Request, Response, NextFunction } from 'express';
import { CadastrosController } from './cadastros.controller';
import { CadastrosRepository } from './cadastros.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './cadastros.validation';

const cadastrosRepository = new CadastrosRepository(dataSource);
const controller = new CadastrosController(cadastrosRepository);
const cadastrosRoute = Router();

cadastrosRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
cadastrosRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
cadastrosRoute.get('/:cadastrosId', (req: Request<{ cadastrosId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
cadastrosRoute.patch('/:cadastrosId', updateValidation, (req: Request<{ cadastrosId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
cadastrosRoute.delete('/:cadastrosId', (req: Request<{ cadastrosId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
cadastrosRoute.get('/by-endereco', (req: Request<{}, {}, {}, { endereco: string }>, res: Response, next: NextFunction) => controller.findByEndereco(req, res, next));
cadastrosRoute.get('/by-enderecos', (req: Request<{}, {}, {}, { endereco: string }>, res: Response, next: NextFunction) => 
controller.findAllEndereco(req, res, next));
cadastrosRoute.get('/by-compl', (req: Request<{}, {}, {}, { complemento: string }>, res: Response, next: NextFunction) => controller.findByCompl(req, res, next));
cadastrosRoute.get('/by-compls', (req: Request<{}, {}, {}, { complemento: string }>, res: Response, next: NextFunction) => 
controller.findAllCompl(req, res, next));
cadastrosRoute.get('/by-bairro', (req: Request<{}, {}, {}, { bairro: string }>, res: Response, next: NextFunction) => 
controller.findByBairro(req, res, next));
cadastrosRoute.get('/all-bairro', (req: Request<{}, {}, {}, { bairro: string }>, res: Response, next: NextFunction) => controller.findAllBairro(req, res, next));
cadastrosRoute.get('/by-cep', (req: Request<{}, {}, {}, { cep: string }>, res: Response, next: NextFunction) => controller.findByCep(req, res, next));
cadastrosRoute.get('/all-cep', (req: Request<{}, {}, {}, { cep: string }>, res: Response, next: NextFunction) => controller.findAllCep(req, res, next));
cadastrosRoute.get('/pessoa/:pessoaId', (req, res, next) => controller.findAllPessoaId(req, res, next));
cadastrosRoute.get('/empresa/:empresaId', (req, res, next) => controller.findAllEmpresaId(req, res, next));
cadastrosRoute.get('/consumidores/:consumidorId', (req, res, next) => controller.findAllConsumidorId(req, res, next));
cadastrosRoute.get('/fornecedores/:fornecedorId', (req, res, next) => controller.findAllFornecedorId(req, res, next));
cadastrosRoute.get('/clientes/:clienteId', (req, res, next) => controller.findAllClienteId(req, res, next));
cadastrosRoute.get('/funcionarios/:funcionarioId', (req, res, next) => controller.findAllFuncionarioId(req, res, next));

export { cadastrosRoute, cadastrosRepository };

