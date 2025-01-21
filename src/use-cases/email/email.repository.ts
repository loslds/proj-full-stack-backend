import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { EmailEntity } from './email.entity';
import type { EmailCreate } from './email.dto';

export class EmailRepository {
  private repo: Repository<EmailEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmailEntity);
  }

  // Cria um novo registro de Email
  async createEmail(email: EmailCreate): Promise<EmailEntity> {
    const data = this.repo.create(email);
    return this.repo.save(data);
  }

  // Atualiza um registro de Email pelo ID fornecido
  async updateEmail(
    emailId: number,
    email: DeepPartial<EmailEntity>,
  ): Promise<EmailEntity> {
    if (!emailId || isNaN(emailId) || emailId <= 0) {
      throw new Error('Invalid emailId');
    }

    await this.repo.update(emailId, email);
    const updatedEmail = await this.findEmailById(emailId);

    if (!updatedEmail) {
      throw new Error(`Email with id ${emailId} not found`);
    }

    return updatedEmail;
  }

  // Deleta um registro de Email pelo ID
  async deleteEmail(emailId: number): Promise<void> {
    if (!emailId || isNaN(emailId) || emailId <= 0) {
      throw new Error('Invalid emailId');
    }

    await this.repo.delete(emailId);
  }

  // Busca todos os registros de Email com condição opcional
  async findEmailAll(where?: FindOptionsWhere<EmailEntity>): Promise<EmailEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Email pelo ID
  async findEmailById(emailId: number): Promise<EmailEntity | null> {
    if (!emailId || isNaN(emailId) || emailId <= 0) {
      throw new Error('Invalid emailId');
    }

    return this.repo.findOne({ where: { id: emailId } });
  }

  // Busca todos os registros de Email pelo campo mail
  async findEmailAllMail(mail: string): Promise<EmailEntity[]> {
    return this.repo.find({ where: { mail } });
  }

  // Busca um registro de Email pelo campo mail
  async findEmailByMail(mail: string): Promise<EmailEntity | null> {
    return this.repo.findOne({ where: { mail } });
  }

  // Busca todos os registros de Email pelo campo mailresg
  async findEmailAllMailresg(mailresg: string): Promise<EmailEntity[]> {
    return this.repo.find({ where: { mailresg } });
  }

  // Busca um registro de Email pelo campo mailresg
  async findEmailByMailresg(mailresg: string): Promise<EmailEntity | null> {
    return this.repo.findOne({ where: { mailresg } });
  }

  // Busca todos os registros de Email pelo campo id_cadastro
  async findEmailByCadastroId(cadastroId: number): Promise<EmailEntity[]> {
    if (!cadastroId || isNaN(cadastroId) || cadastroId <= 0) {
      throw new Error('Invalid cadastroId');
    }

    return this.repo.find({ where: { id_cadastro: cadastroId } });
  }
}
