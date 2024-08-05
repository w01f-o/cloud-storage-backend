import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  public async sendActivationLink(email: string, link: string) {}
}
