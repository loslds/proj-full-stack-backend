import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { EmailsEntity } from './emails.entity';
import type { EmailsCreate } from './emails.dto';

export class EmailsRepository {
  private repo: Repository<EmailsEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(EmailsEntity);
  }

  // Cria um novo registro de Email
  async createEmails(emails: EmailsCreate): Promise<EmailsEntity> {
    const data = this.repo.create(emails);
    return this.repo.save(data);
  }

  // Atualiza um registro de Email pelo ID fornecido
  async updateEmail(
    emailId: number,
    emails: DeepPartial<EmailsEntity>,
  ): Promise<EmailsEntity> {
    if (!emailId || isNaN(emailId) || emailId <= 0) {
      throw new Error('Invalid emailId');
    }

    await this.repo.update(emailId, emails);
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
  async findEmailAll(where?: FindOptionsWhere<EmailsEntity>): Promise<EmailsEntity[]> {
    return this.repo.find({ where });
  }

  // Busca um registro de Email pelo ID
  async findEmailById(emailId: number): Promise<EmailsEntity | null> {
    if (!emailId || isNaN(emailId) || emailId <= 0) {
      throw new Error('Invalid emailId');
    }

    return this.repo.findOne({ where: { id: emailId } });
  }

  // Busca todos os registros de Email pelo campo mail
  async findEmailAllMail(mail: string): Promise<EmailsEntity[]> {
    return this.repo.find({ where: { mail } });
  }

  // Busca um registro de Email pelo campo mail
  async findEmailByMail(mail: string): Promise<EmailsEntity | null> {
    return this.repo.findOne({ where: { mail } });
  }

  // Busca todos os registros de Email pelo campo mailresg
  async findEmailAllMailresg(mailresg: string): Promise<EmailsEntity[]> {
    return this.repo.find({ where: { mailresg } });
  }

  // Busca um registro de Email pelo campo mailresg
  async findEmailByMailresg(mailresg: string): Promise<EmailsEntity | null> {
    return this.repo.findOne({ where: { mailresg } });
  }

  // Busca todos os registros de Email pelo campo id_cadastros
  async findEmailByCadastrosId(cadastrosId: number): Promise<EmailsEntity[]> {
    if (!cadastrosId || isNaN(cadastrosId) || cadastrosId <= 0) {
      throw new Error('Invalid cadastrosId');
    }

    return this.repo.find({ where: { id_cadastros: cadastrosId } });
  }
}
