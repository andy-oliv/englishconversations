import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Logger } from 'nestjs-pino';
import handleInternalErrorException from '../helper/functions/handleErrorException';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Return from '../common/types/Return';
import loggerMessages from '../helper/messages/loggerMessages';
import generateExceptionMessage from '../helper/functions/generateExceptionMessage';
import httpMessages_EN from '../helper/messages/httpMessages.en';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.client = new S3Client({
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.bucket = this.configService.get<string>('AWS_BUCKET_NAME');
  }

  async putObject(file: Express.Multer.File, key?: string): Promise<string> {
    try {
      const fileName = `${file.originalname
        .toLowerCase()
        .replaceAll(' ', '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')}`; //normalize('NFD').replace(/[\u0300-\u036f]/g, '') = remove accents;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key ? `${key}/${fileName}` : fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', //or 'private'
      });

      await this.client.send(command);

      const url: string = `https://${this.bucket}.s3.amazonaws.com/${key ? `${key}/${fileName}` : fileName}`;

      this.logger.log({
        message: generateExceptionMessage(
          's3Service',
          'putObject',
          loggerMessages.s3.putObject.status_201,
        ),
        url,
      });
      return url;
    } catch (error) {
      handleInternalErrorException(
        's3Service',
        'putObject',
        loggerMessages.s3.putObject.status_500,
        this.logger,
        error,
      );
    }
  }

  async getObject(receivedUrl: string): Promise<Return> {
    try {
      const key: string = new URL(receivedUrl).pathname.slice(1);
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const expiration: number = Number(
        this.configService.get<string>('PRESIGNED_URL_EXPIRATION'),
      );

      if (isNaN(expiration)) {
        throw new InternalServerErrorException(
          httpMessages_EN.s3.getObject.checkenv,
        );
      }
      const url: string = await getSignedUrl(this.client, command, {
        expiresIn: expiration,
      });

      this.logger.log({
        message: generateExceptionMessage(
          's3Service',
          'getObject',
          loggerMessages.s3.getObject.status_200,
        ),
        data: {
          objectKey: key,
          objectSignedUrl: url,
        },
      });
      return {
        message: httpMessages_EN.s3.getObject.status_200,
        data: {
          url,
        },
      };
    } catch (error) {
      handleInternalErrorException(
        's3Service',
        'getObject',
        loggerMessages.s3.getObject.status_500,
        this.logger,
        error,
      );
    }
  }

  async deleteObject(key: string): Promise<{ message: string }> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);

      this.logger.log({
        message: generateExceptionMessage(
          's3Service',
          'deleteObject',
          loggerMessages.s3.deleteObject.status_200,
        ),
        objectKey: key,
      });
      return { message: httpMessages_EN.s3.deleteObject.status_200 };
    } catch (error) {
      handleInternalErrorException(
        's3Service',
        'deleteObject',
        loggerMessages.s3.deleteObject.status_500,
        this.logger,
        error,
      );
    }
  }
}
