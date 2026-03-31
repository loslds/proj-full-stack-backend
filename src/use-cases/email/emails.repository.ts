
// C:\repository\proj-full-stack-backend\src\use-cases\email\emails.repository.ts
import {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  Repository
} from 'typeorm';

import { EmailsEntity } from './emails.entity';
import type { EmailsCreate } from './emails.dto';

export class EmailsRepository {
  private repo: Repository<EmailsEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmailsEntity);
  }

  // ============================================================
  // * DUPLICIDADE *
  // ============================================================
  async hasDuplicatedEmail(
    email: string,
    excludes: number[] = []
  ): Promise<EmailsEntity | null> {
    const query = this.repo
      .createQueryBuilder('emails')
      .where('emails.email = :email', { email });

    if (excludes.length > 0) {
      query.andWhere('emails.id NOT IN (:...excludes)', { excludes });
    }

    return query.getOne();
  }

  // ============================================================
  // * CRUD *
  // ============================================================
  async findEmailsAll(
    where?:
      | FindOptionsWhere<EmailsEntity>
      | FindOptionsWhere<EmailsEntity>[],
    orderBy: FindOptionsOrder<EmailsEntity> = { id: 'ASC' }
  ): Promise<EmailsEntity[]> {
    return this.repo.find({
      where,
      relations: {
        cadastros: {
          empresas: true,
          visitantes: true,
          consumidores: true,
          clientes: true,
          fornecedores: true,
          funcionarios: true,
          cidades: {
            estados: true
          },
          imagens: true
        }
      },
      order: orderBy
    });
  }

  async createEmails(emails: EmailsCreate): Promise<EmailsEntity> {
    const email = emails.email.trim();
    const email_resgate = emails.email_resgate?.trim() ?? null;

    const duplicated = await this.hasDuplicatedEmail(email);

    if (duplicated) {
      throw new Error('Email já cadastrado!');
    }

    const data = this.repo.create({
      ...emails,
      email,
      email_resgate,
      createdBy: emails.createdBy ?? 0,
      updatedBy: emails.updatedBy ?? 0
    });

    try {
      return await this.repo.save(data);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new Error('Email já cadastrado!');
      }

      throw error;
    }
  }

  async findOneEmailsById(emailsId: number): Promise<EmailsEntity | null> {
    this.validateId(emailsId);

    return this.repo.findOne({
      where: { id: emailsId },
      relations: {
        cadastros: {
          empresas: true,
          visitantes: true,
          consumidores: true,
          clientes: true,
          fornecedores: true,
          funcionarios: true,
          cidades: {
            estados: true
          },
          imagens: true
        }
      }
    });
  }

  async updateEmailsId(
    emailsId: number,
    emails: DeepPartial<EmailsEntity>
  ): Promise<EmailsEntity> {
    this.validateId(emailsId);

    const current = await this.repo.findOne({
      where: { id: emailsId }
    });

    if (!current) {
      throw new Error(`Email ID ${emailsId} não encontrado.`);
    }

    const email = emails.email?.trim() ?? current.email;
    const email_resgate =
      emails.email_resgate !== undefined
        ? emails.email_resgate?.trim() ?? null
        : current.email_resgate;

    if (email !== current.email) {
      const duplicated = await this.hasDuplicatedEmail(email, [emailsId]);

      if (duplicated) {
        throw new Error('Email já cadastrado!');
      }
    }

    const data = this.repo.create({
      ...current,
      ...emails,
      email,
      email_resgate,
      id: emailsId
    });

    try {
      return await this.repo.save(data);
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new Error('Email já cadastrado!');
      }

      throw error;
    }
  }

  async deleteEmailsId(emailsId: number): Promise<boolean> {
    this.validateId(emailsId);

    const result = await this.repo.delete(emailsId);

    if (result.affected === 0) {
      throw new Error(`Email ID ${emailsId} não encontrado.`);
    }

    return true;
  }

  // ============================================================
  // * CONSULTAS *
  // ============================================================

  /** Pesquisa combinada */
  async searchEmails(params: {
    id?: number;
    email?: string;
    email_resgate?: string;
    id_cadastros?: number;
  }): Promise<EmailsEntity[]> {
    const query = this.repo
      .createQueryBuilder('emails')
      .leftJoinAndSelect('emails.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('emails.id', 'ASC');

    if (typeof params.id === 'number') {
      query.andWhere('emails.id = :id', { id: params.id });
    }

    if (params.email) {
      query.andWhere(
        'emails.email LIKE :email COLLATE utf8mb4_general_ci',
        { email: `%${params.email}%` }
      );
    }

    if (params.email_resgate) {
      query.andWhere(
        'emails.email_resgate LIKE :email_resgate COLLATE utf8mb4_general_ci',
        { email_resgate: `%${params.email_resgate}%` }
      );
    }

    if (typeof params.id_cadastros === 'number') {
      query.andWhere('emails.id_cadastros = :id_cadastros', {
        id_cadastros: params.id_cadastros
      });
    }

    return query.getMany();
  }

  /** Busca um email exato */
  async findOneEmailsEmail(email: string): Promise<EmailsEntity | null> {
    return this.repo.findOne({
      where: { email },
      relations: {
        cadastros: {
          empresas: true,
          visitantes: true,
          consumidores: true,
          clientes: true,
          fornecedores: true,
          funcionarios: true,
          cidades: {
            estados: true
          },
          imagens: true
        }
      }
    });
  }

  /** Busca todos os emails exatos */
  async findAllEmailsEmail(email: string): Promise<EmailsEntity[]> {
    return this.repo.find({
      where: { email },
      relations: {
        cadastros: {
          empresas: true,
          visitantes: true,
          consumidores: true,
          clientes: true,
          fornecedores: true,
          funcionarios: true,
          cidades: {
            estados: true
          },
          imagens: true
        }
      },
      order: { id: 'ASC' }
    });
  }

  /** Busca um email_resgate exato */
  async findOneEmailsEmailResgate(
    email_resgate: string
  ): Promise<EmailsEntity | null> {
    return this.repo.findOne({
      where: { email_resgate },
      relations: {
        cadastros: {
          empresas: true,
          visitantes: true,
          consumidores: true,
          clientes: true,
          fornecedores: true,
          funcionarios: true,
          cidades: {
            estados: true
          },
          imagens: true
        }
      }
    });
  }

  /** Busca todos os email_resgate exatos */
  async findAllEmailsEmailResgate(
    email_resgate: string
  ): Promise<EmailsEntity[]> {
    return this.repo.find({
      where: { email_resgate },
      relations: {
        cadastros: {
          empresas: true,
          visitantes: true,
          consumidores: true,
          clientes: true,
          fornecedores: true,
          funcionarios: true,
          cidades: {
            estados: true
          },
          imagens: true
        }
      },
      order: { id: 'ASC' }
    });
  }

  /** Busca parcial por text */
  async searchEmailsParcial(text?: string): Promise<EmailsEntity[]> {
    const query = this.repo
      .createQueryBuilder('emails')
      .leftJoinAndSelect('emails.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('emails.id', 'ASC');

    if (text && text.trim() !== '') {
      query.andWhere(
        '(emails.email LIKE :text OR emails.email_resgate LIKE :text) COLLATE utf8mb4_general_ci',
        { text: `%${text}%` }
      );
    }

    return query.getMany();
  }

  /** Busca todos os emails por cadastro */
  async findAllEmailsByCadastrosId(
    cadastrosId: number
  ): Promise<EmailsEntity[]> {
    return this.repo.find({
      where: { id_cadastros: cadastrosId },
      relations: {
        cadastros: {
          empresas: true,
          visitantes: true,
          consumidores: true,
          clientes: true,
          fornecedores: true,
          funcionarios: true,
          cidades: {
            estados: true
          },
          imagens: true
        }
      },
      order: { id: 'ASC' }
    });
  }

  /** Lista todos com details */
  async listAllEmailsDetails(): Promise<EmailsEntity[]> {
    return this.repo
      .createQueryBuilder('emails')
      .leftJoinAndSelect('emails.cadastros', 'cadastros')
      .leftJoinAndSelect('cadastros.empresas', 'empresas')
      .leftJoinAndSelect('cadastros.visitantes', 'visitantes')
      .leftJoinAndSelect('cadastros.consumidores', 'consumidores')
      .leftJoinAndSelect('cadastros.clientes', 'clientes')
      .leftJoinAndSelect('cadastros.fornecedores', 'fornecedores')
      .leftJoinAndSelect('cadastros.funcionarios', 'funcionarios')
      .leftJoinAndSelect('cadastros.cidades', 'cidades')
      .leftJoinAndSelect('cidades.estado', 'estado')
      .leftJoinAndSelect('cadastros.imagens', 'imagens')
      .orderBy('emails.id', 'ASC')
      .getMany();
  }

  // ============================================================
  // * UTIL *
  // ============================================================
  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new Error('Invalid emailsId');
    }
  }
}