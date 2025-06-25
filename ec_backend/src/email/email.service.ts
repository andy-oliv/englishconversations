import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ResendObject from '../common/types/ResendObject';
import { Resend } from 'resend';
import { Logger } from 'nestjs-pino';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import loggerMessages from '../helper/messages/loggerMessages';

@Injectable()
export class EmailService {
  private readonly resend = new Resend(
    this.configService.get<string>('RESEND_API_KEY'),
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async sendEmail(template: ResendObject): Promise<void> {
    try {
      await this.resend.emails.send(template);
    } catch (error) {
      handleInternalErrorException(
        'emailService',
        'sendEmail',
        loggerMessages.email.sendEmail.status_500,
        this.logger,
        error,
      );
    }
  }
}
