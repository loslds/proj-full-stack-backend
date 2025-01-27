
import { Router, Request, Response, NextFunction } from 'express';
import { CadastroController } from './cadastro.controller';
import { CadastroRepository } from './cadastro.repository';
import { dataSource } from '../../database/dataSource';
import { createValidation, updateValidation } from './cadastros.validation';

const cadastroRepository = new CadastroRepository(dataSource);
const controller = new CadastroController(cadastroRepository);
const cadastroRoute = Router();

cadastroRoute.get('/', (req: Request, res: Response, next: NextFunction) => controller.findAll(req, res, next));
cadastroRoute.post('/', createValidation, (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next));
cadastroRoute.get('/:cadastroId', (req: Request<{ cadastroId: string }>, res: Response, next: NextFunction) => controller.getOne(req, res, next));
cadastroRoute.patch('/:cadastroId', updateValidation, (req: Request<{ cadastroId: string }>, res: Response, next: NextFunction) => controller.update(req, res, next));
cadastroRoute.delete('/:cadastroId', (req: Request<{ cadastroId: string }>, res: Response, next: NextFunction) => controller.remove(req, res, next));
cadastroRoute.get('/by-endereco', (req: Request<{}, {}, {}, { endereco: string }>, res: Response, next: NextFunction) => controller.findByEndereco(req, res, next));
cadastroRoute.get('/by-enderecos', (req: Request<{}, {}, {}, { endereco: string }>, res: Response, next: NextFunction) => 
controller.findAllEndereco(req, res, next));
cadastroRoute.get('/by-compl', (req: Request<{}, {}, {}, { complemento: string }>, res: Response, next: NextFunction) => controller.findByCompl(req, res, next));
cadastroRoute.get('/by-compls', (req: Request<{}, {}, {}, { complemento: string }>, res: Response, next: NextFunction) => 
controller.findAllCompl(req, res, next));
cadastroRoute.get('/by-bairro', (req: Request<{}, {}, {}, { bairro: string }>, res: Response, next: NextFunction) => 
controller.findByBairro(req, res, next));
cadastroRoute.get('/all-bairro', (req: Request<{}, {}, {}, { bairro: string }>, res: Response, next: NextFunction) => controller.findAllBairro(req, res, next));
cadastroRoute.get('/by-cep', (req: Request<{}, {}, {}, { cep: string }>, res: Response, next: NextFunction) => controller.findByCep(req, res, next));
cadastroRoute.get('/all-cep', (req: Request<{}, {}, {}, { cep: string }>, res: Response, next: NextFunction) => controller.findAllCep(req, res, next));
cadastroRoute.get('/pessoa/:pessoaId', (req, res, next) => controller.findAllPessoaId(req, res, next));
cadastroRoute.get('/empresa/:empresaId', (req, res, next) => controller.findAllEmpresaId(req, res, next));
cadastroRoute.get('/consumidor/:consumidorId', (req, res, next) => controller.findAllConsumidorId(req, res, next));
cadastroRoute.get('/fornecedor/:fornecedorId', (req, res, next) => controller.findAllFornecedorId(req, res, next));
cadastroRoute.get('/cliente/:clienteId', (req, res, next) => controller.findAllClienteId(req, res, next));
cadastroRoute.get('/funcionario/:funcionarioId', (req, res, next) => controller.findAllFuncionarioId(req, res, next));

export { cadastroRoute, cadastroRepository };

