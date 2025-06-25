import { ConfigService } from '@nestjs/config';
import ResendObject from '../../../common/types/ResendObject';

export default function generateEmailConfirmationTemplate(
  name: string,
  email: string,
  token: string,
  configService: ConfigService,
): ResendObject {
  const template: ResendObject = {
    from: 'Equipe English Conversations <noreply@englishconversations.com.br>',
    to: [email],
    subject: 'Welcome!',
    html: `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmação de Email - English Conversations</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f6f6f6;">
    <center>
      <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td align="center" style="padding-top: 48px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; font-family: 'Poppins', sans-serif, Arial;">
              <tr>
                <td style="background-color: #000000; padding: 16px 0; text-align: center;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 16px;">
                        <img
                          src="${configService.get<string>('LOGO_URL')}"
                          alt="English Conversations Logo"
                          width="210"
                          height="auto"
                          style="display: block; max-width: 210px; height: auto;"
                        />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 48px 48px 0 48px; text-align: center;">
                  <h1 style="color: #000000; font-size: 28px; line-height: 36px; margin: 0;">Falta pouco!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 48px 0 48px;">
                  <p style="color: #000000; font-size: 14px; line-height: 22px; text-align: justify; margin: 0;">
                    Olá, ${name.split(' ')[0]}! Seja bem-vindo(a) ao English Conversations! Para garantir a segurança da
                    sua conta e liberar todas as funcionalidades, precisamos que você
                    confirme seu e-mail. Basta clicar no botão abaixo:
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 48px 0 48px;" align="center">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                      <td align="center" style="border-radius: 8px; background-color: #3ab2f6; padding: 16px 32px;">
                        <a
                          href="${configService.get<string>('FRONTEND_URL')}/auth/register?token=${token}"
                          target="_blank"
                          style="
                            font-size: 16px;
                            font-weight: 700;
                            line-height: 1.2;
                            text-decoration: none;
                            color: #ffffff;
                            display: inline-block;
                          "
                          >Confirmar email</a
                        >
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 48px 0 48px;">
                  <p style="color: #000000; font-size: 14px; line-height: 22px; text-align: justify; margin: 0;">
                    Este link é válido por 30 minutos. Se você não se cadastrou em nossa
                    plataforma, pode ignorar esta mensagem. Qualquer dúvida, estamos aqui
                    para ajudar.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 48px 48px 48px; text-align: center;">
                  <p style="color: #000000; font-size: 14px; line-height: 22px; margin: 0;">
                    <br />Abraços, <br />Equipe English Conversations
                  </p>
                </td>
              </tr>
              </table>
          </td>
        </tr>
      </table>
    </center>
  </body>`,
  };

  return template;
}
