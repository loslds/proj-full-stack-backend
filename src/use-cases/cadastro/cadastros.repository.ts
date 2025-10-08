//C:\repository\proj-full-stack-backend\src\use-cases\consumidor\consumidores.repository.ts

import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CadastrosEntity } from './cadastros.entity';
import type { CadastrosCreate } from './cadastros.dto';

export class CadastrosRepository {
  private repo: Repository<CadastrosEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(CadastrosEntity);
  }

  // Criação da tabela (raw query) - manter FK
  async createNotExistsCadastros(): Promise<void> {
    await this.dataSource.query(`
    CREATE TABLE IF NOT EXISTS cadastros (  
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      id_empresas INT UNSIGNED DEFAULT NULL,
      id_consumidores INT UNSIGNED DEFAULT NULL,
      id_clientes INT UNSIGNED DEFAULT NULL,
      id_fornecedores INT UNSIGNED DEFAULT NULL,
      id_funcionarios INT UNSIGNED DEFAULT NULL,

      endereco VARCHAR(200) DEFAULT NULL,
      complemento VARCHAR(200) DEFAULT NULL,
      bairro VARCHAR(100) DEFAULT NULL,
      cep VARCHAR(9) DEFAULT NULL,

      has_email TINYINT(1) NOT NULL DEFAULT 0,
      has_fone TINYINT(1) NOT NULL DEFAULT 0,
      has_doc TINYINT(1) NOT NULL DEFAULT 0,

      createdBy INT DEFAULT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedBy INT DEFAULT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_cadastros_empresas FOREIGN KEY (id_empresas) REFERENCES empresas(id),
      CONSTRAINT fk_cadastros_consumidores FOREIGN KEY (id_consumidores) REFERENCES consumidores(id),
      CONSTRAINT fk_cadastros_clientes FOREIGN KEY (id_clientes) REFERENCES clientes(id),
      CONSTRAINT fk_cadastros_fornecedores FOREIGN KEY (id_fornecedores) REFERENCES fornecedores(id),
      CONSTRAINT fk_cadastros_funcionarios FOREIGN KEY (id_funcionarios) REFERENCES funcionarios(id),

      INDEX idx_empresas (id_empresas),
      INDEX idx_consumidores (id_consumidores),
      INDEX idx_clientes (id_clientes),
      INDEX idx_fornecedores (id_fornecedores),
      INDEX idx_funcionarios (id_funcionarios),

      CHECK (
        (id_empresas IS NOT NULL) +
        (id_consumidores IS NOT NULL) +
        (id_clientes IS NOT NULL) +
        (id_fornecedores IS NOT NULL) +
        (id_funcionarios IS NOT NULL) = 1
        )
      )
    `);
  }

  /** src/use-cases/cadastro/cadastros.repository.ts
    * Verifica duplicidade de cadastro para a entidade informada.
    * Somente um ID (empresa, consumidor, cliente, fornecedor ou funcionário) deve ser informado.
  */

  async hasDuplicated(
    id_empresas?: number,
    id_consumidores?: number,
    id_clientes?: number,
    id_fornecedores?: number,
    id_funcionarios?: number,
    excludeId?: number  // usado em updates
  ): Promise<boolean> {
    const queryParts: string[] = [];
    const params: any[] = [];

    if (id_empresas) {
      queryParts.push(`id_empresas = ?`);
      params.push(id_empresas);
    }
    if (id_consumidores) {
      queryParts.push(`id_consumidores = ?`);
      params.push(id_consumidores);
    }
    if (id_clientes) {
      queryParts.push(`id_clientes = ?`);
      params.push(id_clientes);
    }
    if (id_fornecedores) {
      queryParts.push(`id_fornecedores = ?`);
      params.push(id_fornecedores);
    }
    if (id_funcionarios) {
      queryParts.push(`id_funcionarios = ?`);
      params.push(id_funcionarios);
    }

    if (queryParts.length !== 1) {
      // ❌ Garante que só um ID foi passado (regra de negócio)
      throw new Error('É necessário informar exatamente UM tipo de entidade para o cadastro.');
    }

    let sql = `
      SELECT COUNT(*) as total
      FROM cadastros
      WHERE ${queryParts[0]}
    `;

    if (excludeId) {
      sql += ` AND id <> ?`;
      params.push(excludeId);
    }

    const [result]: any[] = await this.dataSource.query(sql, params);
    return result.total > 0;
  }



  // 1  Cria Novo registro
  // 1️⃣ Cria Novo Registro
  async createCadastros(cadastros: CadastrosCreate): Promise<CadastrosEntity> {
    
    // ✅ Verifica duplicidade lógica
    const duplicated = await this.hasDuplicated(
      cadastros.id_empresas,
      cadastros.id_consumidores,
      cadastros.id_clientes,
      cadastros.id_fornecedores,
      cadastros.id_funcionarios
    );

    if (duplicated) {
      throw new Error('Já existe um cadastro para esta entidade.');
    }

    try {
      const data = this.repo.create(cadastros);
      return await this.repo.save(data);
    } catch (error: any) {
      // ⚠️ Tratamento do erro do CHECK do MySQL
      if (error.code === '3819') { // MySQL Check constraint violated
        throw new Error('Selecione apenas uma entidade para o cadastro.');
      }
      throw error;
    }
  }
  


  // 2 Atualiza registro com validação de duplicidade
  async updateCadastrosId(
    cadastrosId: number,
    cadastros: DeepPartial<CadastrosEntity>
  ): Promise<CadastrosEntity> {
    const {
      id_empresas,
      id_consumidores,
      id_clientes,
      id_fornecedores,
      id_funcionarios,
    } = cadastros;

    // 🧠 Verifica duplicidade de forma idêntica à create
    const queryParts: string[] = [];
    const params: any = {};

    if (id_empresas) {
      queryParts.push('cadastros.id_empresas = :id_empresas');
      params.id_empresas = id_empresas;
    }
    if (id_consumidores) {
      queryParts.push('cadastros.id_consumidores = :id_consumidores');
      params.id_consumidores = id_consumidores;
    }
    if (id_clientes) {
      queryParts.push('cadastros.id_clientes = :id_clientes');
      params.id_clientes = id_clientes;
    }
    if (id_fornecedores) {
      queryParts.push('cadastros.id_fornecedores = :id_fornecedores');
      params.id_fornecedores = id_fornecedores;
    }
    if (id_funcionarios) {
      queryParts.push('cadastros.id_funcionarios = :id_funcionarios');
      params.id_funcionarios = id_funcionarios;
    }

    if (queryParts.length !== 1) {
      throw new Error('É necessário informar exatamente um ID de entidade para atualizar.');
    }

    const duplicated = await this.repo
      .createQueryBuilder('cadastros')
      .where(queryParts[0], params)
      .andWhere('cadastros.id != :id', { id: cadastrosId })
      .getOne();

    if (duplicated) {
      throw new Error('Já existe um cadastro para esta entidade.');
    }

    // ✅ Se passou, faz o update normalmente
    const data = this.repo.create({ id: cadastrosId, ...cadastros });
    return this.repo.save(data);
  }

  // 3 Deleta registro 
  async deleteCadastrosId(cadastrosId: number) {
    const result = await this.repo.delete(cadastrosId);
    if (result.affected === 0) {
      throw new Error(`Ccadastro com ID ${cadastrosId} não encontrada.`);
    }
    return true;
  }

  // 4 Busca por ID  
  async findOneCadastrosById(cadastrosId: number) {
    const cadastro = await this.repo.findOne({
      where: { id: cadastrosId },
      relations: ['empresas', 'consumidores', 'clientes', 'fornecedores', 'funcionarios'],
    });

    if (!cadastro) {
      throw new Error(`Cadastro com ID ${cadastrosId} não encontrado.`);
    }

    return cadastro;
  }

  // 4 Busca todos registros com filtro opcional 
  async findCadastrosAll(
    where?: FindOptionsWhere<CadastrosEntity>,
    orderBy: Record<string, "ASC" | "DESC"> = { id: "ASC" }
  ): Promise<CadastrosEntity[]> {
    return this.repo.find({
      where,
      relations: ['empresas', 'consumidores', 'clientes', 'fornecedores', 'funcionarios'],
      order: orderBy,
    });
  }

  // Busca por nome 6
  async findOneClientesByNome(nome: string) {
    return this.repo.findOne({
      where: { nome },
      relations: ['pessoas', 'imagens'],
    });
  }


  // Busca por fantasy 7
  async findOneClientesByFantasy(fantasy: string) {
    return this.repo.findOne({
      where: { fantasy },
      relations: ['pessoas', 'imagens'],
    });
  }


  // 8 Pesquisa empresas por ID, nome ou fantasy 
  async searchClientes(params: { id?: number; nome?: string; fantasy?: string }) {
    const query = this.repo.createQueryBuilder('clientes')
      .leftJoinAndSelect('clientes.pessoas', 'pessoas')
      .leftJoinAndSelect('clientes.imagens', 'imagens')
      .orderBy('clientes.id', 'ASC');

    if (params.id) query.andWhere('clientes.id = :id', { id: params.id });
    if (params.nome) query.andWhere('clientes.nome LIKE :nome', { nome: `%${params.nome}%` });
    if (params.fantasy) query.andWhere('clientes.fantasy LIKE :fantasy', { fantasy: `%${params.fantasy}%` });

    return query.getMany();
  }

  // 9
  async findAllClientesByPessoasId(pessoasId: number) {
    return this.repo.find({ where: { id_pessoas: pessoasId } });
  }

  // 10
  async findAllClientesByImagensId(imagensId: number) {
    return this.repo.find({ where: { id_imagens: imagensId } });
  }

  /** 11 Lista todas consumidores com pessoa + imagem  13*/
  async listAllClientesDetails() {
    return this.repo
      .createQueryBuilder('clientes')
      .leftJoinAndSelect('clientes.pessoas', 'pessoas')
      .leftJoinAndSelect('clientes.imagens', 'imagens')
      .getMany();
  }

}




  


