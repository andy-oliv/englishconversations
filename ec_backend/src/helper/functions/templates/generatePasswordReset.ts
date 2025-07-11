import { ConfigService } from '@nestjs/config';
import ResendObject from '../../../common/types/ResendObject';

export default function generatePasswordResetEmailTemplate(
  email: string,
  token: string,
  configService: ConfigService,
): ResendObject {
  const template: ResendObject = {
    from: 'Reset - English Conversations <noreply@englishconversations.com.br>',
    to: [email],
    subject: 'Redefina sua senha',
    html: `  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redefinição de Senha</title>
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        width: 100% !important;
        background-color: black;
      }
      table {
        border-spacing: 0;
        font-family: Poppins, Arial, sans-serif;
        color: #333333;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
      }
      .wrapper {
        width: 100%;
        table-layout: fixed;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      @media only screen and (max-width: 620px) {
        .main-wrapper {
          width: 100% !important;
        }
        .content-padding {
          padding: 2em 1em !important;
        }
        .logo-img {
          width: 30% !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: black;">
    <table
      role="presentation"
      class="wrapper"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: black;"
    >
      <tr>
        <td align="center" style="padding: 0;">
          <table
            role="presentation"
            class="main-wrapper"
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            align="center"
            style="width: 600px; max-width: 600px; margin-top: 3em;"
          >
            <tr>
              <td
                align="center"
                style="
                  background-color: white;
                  padding: 3em 5em;
                  border-radius: 0.5em;
                  font-family: Poppins, Arial, sans-serif;
                  color: #333333;
                "
                class="content-padding"
              >
                <h1
                  style="
                    margin: 0 0 1em 0;
                    font-size: 2em;
                    line-height: 1.2;
                    color: #333333;
                  "
                >
                  Redefinição de senha
                </h1>
                <p
                  style="
                    margin: 0 0 1em 0;
                    font-size: 1em;
                    line-height: 1.5;
                    color: #333333;
                  "
                >
                  Olá! O sistema do English Conversations recebeu uma solicitação
                  para redefinição de senha.
                </p>
                <p
                  style="
                    margin: 0 0 2em 0;
                    font-size: 1em;
                    line-height: 1.5;
                    color: #333333;
                  "
                >
                  Clique no link abaixo para redefinir sua senha:
                </p>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  align="center"
                  style="margin-bottom: 2em;"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        border-radius: 0.5em;
                        background-color: #3ab2f6;
                        background: linear-gradient(to right, #f9d748, #3ab2f6);
                      "
                    >
                      <a
                        href="${configService.get<string>(
                          'FRONTEND_URL',
                        )}/password-reset?token=${token}"
                        target="_blank"
                        style="
                          color: white;
                          text-decoration: none;
                          font-weight: 600;
                          font-size: 1em;
                          display: inline-block;
                          padding: 1em 2em;
                          border-radius: 0.5em;
                          text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
                          font-family: Poppins, Arial, sans-serif;
                          mso-hide: all;
                        "
                      >
                        Redefinir senha
                      </a>
                    </td>
                  </tr>
                </table>
                <p
                  style="
                    font-size: 0.9em;
                    margin-top: 5em;
                    line-height: 1.5;
                    color: #333333;
                  "
                >
                  Este link expira em 30 minutos. Caso você não tenha feito esta
                  solicitação, apenas ignore este email.
                </p>
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="
                  background-color: black;
                  padding: 1.5em 0;
                  border-radius: 0.5em;
                "
              >
                <img
                  src="${configService.get<string>('LOGO_URL')}"
                  alt="English Conversations Logo"
                  width="150"
                  height="auto"
                  style="
                    display: block;
                    max-width: 150px;
                    height: auto;
                    border: 0;
                  "
                  class="logo-img"
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 3em;"></td>
      </tr>
    </table>
  </body>`,
  };

  return template;
}
